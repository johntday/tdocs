Nouns = new Meteor.Collection('coll_nouns');
/*------------------------------------------------------------------------------------------------------------------------------*/
// Create a collection where users can only modify documents that
// they own. Ownership is tracked by an 'userId' field on each
// document. All documents must be owned by the user (or userId='admin') that created
// them and ownership can't be changed. Only a document's owner (or userId='admin')
// is allowed to delete it, and the 'locked' attribute can be
// set on a document to prevent its accidental deletion.

Nouns.allow({
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

Nouns.deny({
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
	createNoun: function(properties, parent_id){
		console.log(properties);
		var user = Meteor.user();
		var userId = getDocUserIdForSaving(properties, user);
		var slug = generateSlug(properties.title);
		var nounWithSameTitle = Nouns.findOne( {project_id: properties.project_id, class_name:properties.class_name, instance_name: slug} );
		var nounId = '';

		if (!user)
			throw new Meteor.Error(601, 'You need to login to create a new '+properties.class_name);
		if(!properties.title)
			throw new Meteor.Error(602, 'Please add a title');
		if(!properties.project_id)
			throw new Meteor.Error(602, 'Must select a project first');
		if(nounWithSameTitle)
			throw new Meteor.Error(602, 'One already exists with title "' + nounWithSameTitle.title + '"');

		var noun = extendWithMetadataForInsert( properties, userId, user );
		_.extend(noun, {instance_name: slug});

		nounId = Nouns.insert(noun);
		noun.nounId = nounId;

		var obj = _.object([[properties.children_name, noun.instance_name]]);
		if (!this.isSimulation && parent_id) {
			Nouns.update(parent_id, {$addToSet: obj});
		}
		// NOTIFICATION
//		if (! isAdmin(user)) {
//			var n = notificationFactory(MOVIE_CREATED_BY_USER, "noun", "admin", noun.title, noun.status, "/nouns/"+nounId, noun.created);
//			Notifications.insert(n);
//		}

		return noun;
	},

	updateNoun: function(_id, properties){
		var user = Meteor.user();
		if (!user)
			throw new Meteor.Error(601, 'You need to login to update a '+properties.class_name);
		if(!properties.title)
			throw new Meteor.Error(602, 'Please add a title');

		var noun = extendWithMetadataForUpdate( properties );

		Nouns.update(_id, {$set: noun} );

		// NOTIFICATION
//		if (! isAdmin(user)) {
//			var n = notificationFactory(MOVIE_UPDATED_BY_USER, "noun", "admin", noun.title, noun.status, "/nouns/"+_id, noun.created);
//			Notifications.insert(n);
//		} else {
//			var m = Nouns.findOne(_id);
//			var n = notificationFactory(MOVIE_UPDATED_BY_ADMIN, "noun", m.userId, noun.title, noun.status, "/nouns/"+_id, noun.created);
//			Notifications.insert(n);
//		}
		return noun;
	},

	deleteNoun: function(properties, parent_id) {
		var _id = (properties.original) ? properties.id : properties._id;
		var class_name = (properties.original) ? properties.original.class_name : properties.class_name;
		var instance_name = (properties.original) ? properties.original.instance_name : properties.instance_name;

		var user = Meteor.user();
		if (!user)
			throw new Meteor.Error(601, 'You need to login to delete a '+class_name);
		if (properties.children && properties.children.length > 0)
			throw new Meteor.Error(601, 'Cannot delete a '+class_name+' with children');

		// remove associated stuff
		if(!this.isSimulation) {
			Nouns.update(parent_id, {$pull: {contained_business_capabilities: instance_name}});
		}

		// NOTIFICATION
//		if (isAdmin()) {
//			var m = Nouns.findOne(nounId);
//			var n = notificationFactory(MOVIE_DELETED_BY_ADMIN, "noun", m.userId, m.title, m.status, "/nouns/"+nounId, getNow());
//			Notifications.insert(n);
//		}

		Nouns.remove(_id);
		return;
	},
	updateNounTitle: function(_id, title) {
		var user = Meteor.user();
		if (!user)
			throw new Meteor.Error(601, 'You need to login to update "'+title+'"');
		// NOTIFICATION
		//		if (isAdmin()) {
		//			var m = Nouns.findOne(nounId);
		//			var n = notificationFactory(MOVIE_DELETED_BY_ADMIN, "noun", m.userId, m.title, m.status, "/nouns/"+nounId, getNow());
		//			Notifications.insert(n);
		//		}

		Nouns.update(_id, {$set: {title: title}});
		return;
	},
	moveNoun: function(parent_id_old, parent_id, instance_name, class_name, position) {
		//data.node.parent, data.parent, data.node.original.instance_name, data.node.original.class_name, data.position

		var user = Meteor.user();
		if (!user)
			throw new Meteor.Error(601, 'You need to login to move a '+class_name);

		Nouns.update(parent_id_old, {$pull: {contained_business_capabilities: instance_name}});

		var noun = Nouns.findOne(parent_id);
		if (!noun) return;
		Nouns.update(parent_id, {$addToSet: {contained_business_capabilities: instance_name}});

		return;
	}
});
