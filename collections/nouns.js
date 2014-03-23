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
		var user = Meteor.user();
		var userId = getDocUserIdForSaving(properties, user);
//		var slug = generateSlug(properties.title, properties.project_id);
//		var nounWithSameTitle = Nouns.findOne( {project_id: properties.project_id, instance_name: slug} );
		var nounId = '';

		if (!user)
			throw new Meteor.Error(601, 'You need to login to create a new '+properties.class_name);
		if(!properties.title)
			throw new Meteor.Error(602, 'Please add a title');
		if(!properties.project_id)
			throw new Meteor.Error(602, 'Must select a project first');
//		if(nounWithSameTitle)
//			throw new Meteor.Error(602, 'One already exists with title "' + nounWithSameTitle.title + '"');

		var noun = extendWithMetadataForInsert( properties, userId, user );
		noun.instance_name = Random.id();

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
//		var slug = generateSlug(properties.title, properties.project_id);
//		var nounWithSameTitle = Nouns.findOne( {project_id: properties.project_id, instance_name: slug} );

		if (!user)
			throw new Meteor.Error(601, 'You need to login to update a '+properties.class_name);
		if(!properties.title)
			throw new Meteor.Error(602, 'Please add a title');
//		if(nounWithSameTitle)
//			throw new Meteor.Error(602, 'One already exists with title "' + nounWithSameTitle.title + '"');

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

	deleteNoun: function(node, parent_id, children_name) {
		var _id = (node.original) ? node.id : node._id;
		var class_name = (node.original) ? node.original.class_name : node.class_name;
		var instance_name = (node.original) ? node.original.instance_name : node.instance_name;

		var user = Meteor.user();
		if (!user)
			throw new Meteor.Error(601, 'You need to login to delete a '+class_name);
		if (node.children && node.children.length > 0)
			throw new Meteor.Error(601, 'Cannot delete a '+class_name+' with children');

		// remove associated stuff
		var obj = _.object([[children_name, instance_name]]);
		if(!this.isSimulation) {
			Nouns.update(parent_id, {$pull: obj});
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
	moveNoun: function(parent_id_old, parent_id, instance_name, class_name, children_name, position) {
		if (!Meteor.user())
			throw new Meteor.Error(601, 'You need to login to move a '+class_name);

		var obj = _.object([[children_name, instance_name]]);

		Nouns.update(parent_id_old, {$pull: obj});

		var noun = Nouns.findOne(parent_id);
		if (!noun) return;
		Nouns.update(parent_id, {$addToSet: obj});

		return;
	}
});
