/*------------------------------------------------------------------------------------------------------------------------------*/
// Create a collection where users can only modify documents that
// they own. Ownership is tracked by an 'userId' field on each
// document. All documents must be owned by the user (or userId='admin') that created
// them and ownership can't be changed. Only a document's owner (or userId='admin')
// is allowed to delete it, and the 'locked' attribute can be
// set on a document to prevent its accidental deletion.

//Relationships.allow({
//	insert: function (userId, doc) {
//		//return ownsDocumentOrAdmin(userId, doc);
//		return false;
//	},
//	update: function (userId, doc, fields, modifier) {
//		return ownsDocumentOrAdmin(userId, doc);
//	},
//	remove: function (userId, doc) {
//		return ownsDocumentOrAdmin(userId, doc);
//	},
//	fetch: ['userId']
//});
//
//Relationships.deny({
//	update: function (userId, docs, fields, modifier) {
//		// can't change the following fields
//		return _.contains(fields, 'userId','owner','class_name');
//	},
//	remove: function (userId, doc) {
//		// can't remove locked documents
//		return doc.locked;
//	},
//	fetch: ['locked'] // no need to fetch 'userId'
//});
/*------------------------------------------------------------------------------------------------------------------------------*/

Meteor.methods({
	/**
	 * properties = {
	 *   project_id: 'xxx'
	 *   ,rel_name: 'composition'
	 *   ,source_instance_name: 'xxx'
	 *   ,target_instance_name: 'xxx'
	 *   ,source_class_name: 'Business_Object'
	 *   ,target_class_name: 'Business_Object'
	 *   ,attrs: [ ['name1','value1'], ['name2','value2'] ]
	 * }
	 * @param properties
	 * @returns {*}
	 */
	createRelationship: function(properties){
		var user = Meteor.user();

		if (!user)
			throw new Meteor.Error(601, 'You need to login to create a new relationship');
		if(!properties.project_id)
			throw new Meteor.Error(602, 'Must select a project first');
		if(!properties.rel_name)
			throw new Meteor.Error(602, 'Please add a rel_name');
		if(!properties.source_instance_name)
			throw new Meteor.Error(602, 'Please add a source_instance_name');
		if(!properties.target_instance_name)
			throw new Meteor.Error(602, 'Please add a target_instance_name');
		if(!properties.source_class_name)
			throw new Meteor.Error(602, 'Please add a source_class_name');
		if(!properties.target_class_name)
			throw new Meteor.Error(602, 'Please add a target_class_name');
		if(properties.attrs  && !_.isArray(properties.attrs) )
			throw new Meteor.Error(602, 'Invalid attrs');
//		val dupRelationship = Relationships.findOne({
//			project_id: properties.project_id
//			,source_instance_name: properties.source_instance_name
//			,target_instance_name: properties.target_instance_name
//			,source_class_name: properties.source_class_name
//			,target_class_name: properties.target_class_name
//			}, {fields:{_id:1}});
//		if(dupRelationship)
//			throw new Meteor.Error(602, 'This relationship already exists');

		properties.instance_name = Random.id();

		var nounId = Relationships.insert(properties);
		properties.nounId = nounId;

		// NOTIFICATION
		//		if (! isAdmin(user)) {
		//			var n = notificationFactory(MOVIE_CREATED_BY_USER, "noun", "admin", noun.title, noun.status, "/nouns/"+nounId, noun.created);
		//			Notifications.insert(n);
		//		}

		return properties;
	}

});
