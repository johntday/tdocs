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
		var userId = getDocUserIdForSaving(properties, user);
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
			Roles.addUsersToRoles(userId, ['admin'], projectId);

			// ADD CONFIGURATION DATA
			var buscap = {
				project_id: projectId,
				instance_name: 'buscap_root'+projectId,
				class_name: ea.class_name.Business_Capability,
				type: 'root',
				title: 'BUSINESS CAPABILITIES',
				contained_business_capabilities: [
					'buscap_top'+projectId
				]
			};
			extendWithMetadataForInsert(buscap, userId, user);
			Nouns.insert(buscap);

			buscap = {
				project_id: projectId,
				instance_name: 'buscap_top'+projectId,
				class_name: ea.class_name.Business_Capability,
				type: 'top',
				title: 'My Top Level Business Capability'
			};
			extendWithMetadataForInsert(buscap, userId, user);
			Nouns.insert(buscap);
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
