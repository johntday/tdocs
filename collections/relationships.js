/*------------------------------------------------------------------------------------------------------------------------------*/
// Create a collection where users can only modify documents that
// they own. Ownership is tracked by an 'userId' field on each
// document. All documents must be owned by the user (or userId='admin') that created
// them and ownership can't be changed. Only a document's owner (or userId='admin')
// is allowed to delete it, and the 'locked' attribute can be
// set on a document to prevent its accidental deletion.

Relationships.allow({
	insert: function (userId, doc) {
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

Relationships.deny({
	update: function (userId, docs, fields, modifier) {
		// can't change the following fields
		return _.contains(fields, 'userId','owner','class_name');
	},
	remove: function (userId, doc) {
		// can't remove locked documents
		return doc.locked;
	},
	fetch: ['locked'] // no need to fetch 'userId'
});
/*------------------------------------------------------------------------------------------------------------------------------*/

Meteor.methods({
	/**
	 * properties = {
	 *   project_id: 'xxx'
	 *   ,rel_name: 'composition'
	 *   ,source_id: 'xxx'
	 *   ,source_title: 'xxx'
	 *   ,source_area_code: 'b'
	 *   ,source_class_name: 'Business_Object'
	 *   ,semantic: 'xxx'
	 *   ,target_id: 'xxx'
	 *   ,target_title: 'xxx'
	 *   ,target_area_code: 'b'
	 *   ,target_class_name: 'Business_Object'
	 * }
	 */
	createRelationship: function(project_id, source_id, target_id, rel_name){
		var user = Meteor.user();

		if (!user)
			throw new Meteor.Error(601, 'You need to login to create a new relationship');
		if(!project_id)
			throw new Meteor.Error(602, 'Must select a project first');
		if(!rel_name)
			throw new Meteor.Error(602, 'Please add a rel_name');
		if(!source_id)
			throw new Meteor.Error(602, 'Please add a source_id');
		if(!target_id)
			throw new Meteor.Error(602, 'Please add a target_id');
//		val dupRelationship = Relationships.findOne({
//			project_id: properties.project_id
//			,source_instance_name: properties.source_instance_name
//			,target_instance_name: properties.target_instance_name
//			,source_class_name: properties.source_class_name
//			,target_class_name: properties.target_class_name
//			}, {fields:{_id:1}});
//		if(dupRelationship)
//			throw new Meteor.Error(602, 'This relationship already exists');
		var rel = {
			project_id: project_id
			,rel_name: rel_name
		};

		//SOURCE
		var source = Nouns.findOne(source_id);
		rel.source_id = source_id;
		rel.source_title = source.title;
		rel.source_area_code = source.area_code;
		rel.source_class_name = source.class_name;

		//TARGET
		var target = Nouns.findOne(target_id);
		rel.target_id = target_id;
		rel.target_title = target.title;
		rel.target_area_code = target.area_code;
		rel.target_class_name = target.class_name;

		//SEMANTIC
		var ea_rel = EA_Relationships.findOne( {rel_name:rel_name, source:rel.source_class_name, target:rel.target_class_name} );
		rel.semantic = (ea_rel) ? ea_rel.semantic : "UNKNOWN";

		var rel_id = Relationships.insert(rel);
		rel._id = rel_id;

		// NOTIFICATION
		//		if (! isAdmin(user)) {
		//			var n = notificationFactory(MOVIE_CREATED_BY_USER, "noun", "admin", noun.title, noun.status, "/nouns/"+nounId, noun.created);
		//			Notifications.insert(n);
		//		}

		return rel_id;
	},
	deleteRelationship: function(_id) {
		var user = Meteor.user();

		if (!user)
			throw new Meteor.Error(601, 'You need to login to delete a relationship');

		Relationships.remove(_id);
	}

});
