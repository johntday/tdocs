Projects = new Meteor.Collection('coll_projects');
/*------------------------------------------------------------------------------------------------------------------------------*/
// Create a collection where users can only modify documents that
// they own. Ownership is tracked by an 'userId' field on each
// document. All documents must be owned by the user (or userId='admin') that created
// them and ownership can't be changed. Only a document's owner (or userId='admin')
// is allowed to delete it, and the 'locked' attribute can be
// set on a document to prevent its accidental deletion.

Projects.allow({
	insert: function (userId, doc) {
		//return ownsDocumentOrAdmin(userId, doc);
		return false;
	},
	update: function (userId, doc, fields, modifier) {
		return ownsDocumentOrAdmin(userId, doc);
	},
	remove: function (userId, doc) {
		return ownsDocumentOrAdmin(userId, doc);
	},
	fetch: ['userId']
});

Projects.deny({
	update: function (userId, docs, fields, modifier) {
		// can't change owners
		return _.contains(fields, 'userId','owner');
	},
	remove: function (userId, doc) {
		// can't remove locked documents
		return doc.locked;
	},
	fetch: ['locked'] // no need to fetch 'userId'
});
/*------------------------------------------------------------------------------------------------------------------------------*/

Meteor.methods({
	createProject: function(properties){
		var user = Meteor.user();
		var userId = user._id;
//		var projectWithSameTitle = Projects.findOne( {title: {$regex: project.title, $options: 'i'}} );
		var projectId = '';

//		if (projectWithSameTitle)
//			throw new Meteor.Error(601, 'Project with this title already exists');
		if (!user)
			throw new Meteor.Error(601, 'You need to login to create a new project');
		if(!properties.title)
			throw new Meteor.Error(602, 'Please add a title');

		var project = extendWithMetadataForInsert( properties, userId, user );

		projectId = Projects.insert(project);
		project.projectId = projectId;

		// NOTIFICATION
//		if (! isAdmin(user)) {
//			var n = notificationFactory(MOVIE_CREATED_BY_USER, "project", "admin", project.title, project.status, "/projects/"+projectId, project.created);
//			Notifications.insert(n);
//		}

		if(!this.isSimulation) {
			initNewProject(user, userId, projectId);
		}
		return project;
	},

	updateProject: function(_id, properties){
		var user = Meteor.user();

		if (!user)
			throw new Meteor.Error(601, 'You need to login to update a project');
		if(!properties.title)
			throw new Meteor.Error(602, 'Please add a title');

		var project = extendWithMetadataForUpdate( properties );

		Projects.update(_id, {$set: project} );

		// NOTIFICATION
//		if (! isAdmin(user)) {
//			var n = notificationFactory(MOVIE_UPDATED_BY_USER, "project", "admin", project.title, project.status, "/projects/"+_id, project.created);
//			Notifications.insert(n);
//		} else {
//			var m = Projects.findOne(_id);
//			var n = notificationFactory(MOVIE_UPDATED_BY_ADMIN, "project", m.userId, project.title, project.status, "/projects/"+_id, project.created);
//			Notifications.insert(n);
//		}
		return project;
	},

	deleteProject: function(_id) {
		var userId = Meteor.userId();
		if (!Roles.userIsInRole(this.userId, ['admin'], _id))
			throw new Meteor.Error(601, 'You need to be an Administrator to delete a project');

		// remove associated stuff
		if(!this.isSimulation) {
			//CASCADE DELETE DEPENDENT STUFF
			Diagrams.remove({project_id: _id});
			Glossarys.remove({project_id: _id});
			Nouns.remove({project_id: _id});
			Tables.remove({project_id: _id});
			Tdocs.remove({project_id: _id});

			//REMOVE FROM USERS
			var query, unset = {};
			query = findUsersByRoles(_id, true);
			unset["roles." + _id] = "";
			Meteor.users.update(
				query,
				{$unset: unset },
				{ multi: true }
			);
		}

		// NOTIFICATION
//		if (isAdmin()) {
//			var m = Projects.findOne(projectId);
//			var n = notificationFactory(MOVIE_DELETED_BY_ADMIN, "project", m.userId, m.title, m.status, "/projects/"+projectId, getNow());
//			Notifications.insert(n);
//		}

		Projects.remove(_id);
		return _id;
	}

});
/*------- INITIALIZE NEW PROJECT WITH DATA ----------------------------------------------*/
function initNewProject(user, userId, projectId) {
	Roles.addUsersToRoles(userId, ['admin'], projectId);

	_.each(projectSeedData, function(data){

		var top = {
			project_id: projectId
			,class_name: data.class_name
			,area_code: ea.getClassBelongsToArea(data.class_name).area_code
			//,type: 'top'
			,title: data.top_title
			,description: data.top_title
		};
		extendWithMetadataForInsert(top, userId, user);
		var top_id = Nouns.insert(top);

		var root = {
			project_id: projectId
			,class_name: data.class_name
			,area_code: ea.getClassBelongsToArea(data.class_name).area_code
			,type: 'root'
			,title: data.root_title
			,description: data.root_title
			,children: [ top_id ]
		};
		extendWithMetadataForInsert(root, userId, user);
		Nouns.insert(root);

	});

}

var projectSeedData = [
	{'class_name': 'Application_Component', root_title: 'APPLICATION COMPONENTS', top_title: 'My Application Component'}
	,{'class_name': 'Application_Interface', root_title: 'APPLICATION INTERFACES', top_title: 'My Application Interface'}
	,{'class_name': 'Application_Service', root_title: 'APPLICATION SERVICES', top_title: 'My Application Service'}
	,{'class_name': 'Application_Function', root_title: 'APPLICATION FUNCTIONS', top_title: 'My Application Function'}
	,{'class_name': 'Application_Data_Object', root_title: 'APPLICATION DATA OBJECTS', top_title: 'My Application Data Object'}
	,{'class_name': 'Business_Domain', root_title: 'BUSINESS DOMAINS', top_title: 'My Business Domain'}
	,{'class_name': 'Business_Actor', root_title: 'BUSINESS ACTORS', top_title: 'My Business Actor'}
	,{'class_name': 'Business_Role', root_title: 'BUSINESS ROLES', top_title: 'My Business Role'}
	,{'class_name': 'Business_Interface', root_title: 'BUSINESS INTERFACES', top_title: 'My Business Interface'}
	,{'class_name': 'Business_Function', root_title: 'BUSINESS FUNCTIONS', top_title: 'My Business Function'}
	,{'class_name': 'Business_Process', root_title: 'BUSINESS PROCESSES', top_title: 'My Business Process'}
	,{'class_name': 'Business_Event', root_title: 'BUSINESS EVENTS', top_title: 'My Business Event'}
	,{'class_name': 'Business_Service', root_title: 'BUSINESS SERVICES', top_title: 'My Business Service'}
	,{'class_name': 'Business_Object', root_title: 'BUSINESS OBJECTS', top_title: 'My Business Object'}
	,{'class_name': 'Business_Location', root_title: 'BUSINESS LOCATIONS', top_title: 'My Business Location'}
	,{'class_name': 'Technology_Artifact', root_title: 'DEPLOYMENT ARTIFACTS', top_title: 'My Deployment Artifact'}
	,{'class_name': 'Technology_Communication_Path', root_title: 'COMMUNICATION PATHS', top_title: 'My Communication Path'}
	,{'class_name': 'Technology_Network', root_title: 'NETWORKS', top_title: 'My Network'}
	,{'class_name': 'Technology_Interface', root_title: 'INFRASTRUCTURE INTERFACES', top_title: 'My Infrastructure Interface'}
	,{'class_name': 'Technology_Function', root_title: 'INFRASTRUCTURE FUNCTIONS', top_title: 'My Infrastructure Function'}
	,{'class_name': 'Technology_Service', root_title: 'INFRASTRUCTURE SERVICES', top_title: 'My Infrastructure Service'}
	,{'class_name': 'Technology_Node', root_title: 'NODES', top_title: 'My Node'}
	,{'class_name': 'Technology_Software', root_title: 'SYSTEM SOFTWARE', top_title: 'My System Software'}
	,{'class_name': 'Technology_Device', root_title: 'DEVICES', top_title: 'My Device'}
	,{'class_name': 'Motivation_Stakeholder', root_title: 'STAKEHOLDERS', top_title: 'My Stakeholder'}
	,{'class_name': 'Motivation_Driver', root_title: 'DRIVERS', top_title: 'My Driver'}
	,{'class_name': 'Motivation_Goal', root_title: 'GOALS', top_title: 'My Goal'}
	,{'class_name': 'Motivation_Principle', root_title: 'PRINCIPLES', top_title: 'My Principle'}
	,{'class_name': 'Motivation_Requirement', root_title: 'REQUIREMENTS', top_title: 'My Requirement'}
	,{'class_name': 'Motivation_Constraint', root_title: 'CONSTRAINTS', top_title: 'My Constraint'}
	,{'class_name': 'Implementation_Work_Package', root_title: 'WORK PACKAGES', top_title: 'My Work Package'}
	,{'class_name': 'Implementation_Deliverable', root_title: 'DELIVERABLES', top_title: 'My Deliverable'}
	,{'class_name': 'Implementation_Plateau', root_title: 'PLATEAUS', top_title: 'My Plateau'}
	,{'class_name': 'Implementation_Gap', root_title: 'GAPS', top_title: 'My Gap'}


];