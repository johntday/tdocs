Glossarys = new Meteor.Collection('coll_glossarys');
/*------------------------------------------------------------------------------------------------------------------------------*/
// Create a collection where users can only modify documents that
// they own. Ownership is tracked by an 'userId' field on each
// document. All documents must be owned by the user (or userId='admin') that created
// them and ownership can't be changed. Only a document's owner (or userId='admin')
// is allowed to delete it, and the 'locked' attribute can be
// set on a document to prevent its accidental deletion.

Glossarys.allow({
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

Glossarys.deny({
	update: function (userId, docs, fields, modifier) {
		// can't change owners
		return _.contains(fields, 'userId','owner','created');
	},
	remove: function (userId, doc) {
		// can't remove locked documents
		return doc.locked;
	},
	fetch: ['locked'] // no need to fetch 'userId'
});
/*------------------------------------------------------------------------------------------------------------------------------*/

Meteor.methods({
	createGlossary: function(properties){
		MyLog("collections/glossarys.js/createGlossary/1", "properties", properties);
		var user = Meteor.user();
		var userId = getDocUserIdForSaving(properties, user);
		var glossaryId = '';

		if (!user)
			throw new Meteor.Error(601, 'You need to login to create a new glossary');
		if(!properties.title)
			throw new Meteor.Error(602, 'Please add a title');
		if ( checkForDupOnServer( Glossarys, 'title', properties.title ) )
			throw new Meteor.Error(603, 'Glossary with title "' + properties.title + '" already exists.  To avoid confusion, Title must be unique when expressed as lower-case');
		if(!properties.project_id)
			throw new Meteor.Error(602, 'Must select a project first');

		var glossary = extendWithMetadataForInsert( properties, userId, user );

		MyLog("collections/glossarys.js/createGlossary/2", "glossary", glossary);

		glossaryId = Glossarys.insert(glossary);
		glossary.glossaryId = glossaryId;

		// NOTIFICATION
//		if (! isAdmin(user)) {
//			var n = notificationFactory(MOVIE_CREATED_BY_USER, "glossary", "admin", glossary.title, glossary.status, "/glossarys/"+glossaryId, glossary.created);
//			Notifications.insert(n);
//		}

		return glossary;
	},

	updateGlossary: function(_id, properties){
		var user = Meteor.user();

		if (!user)
			throw new Meteor.Error(601, 'You need to login to update a glossary');
		if(!properties.title)
			throw new Meteor.Error(602, 'Please add a title');
		if ( checkForDupOnServer( Glossarys, 'title', properties.title, _id ) )
			throw new Meteor.Error(603, 'Glossary with title "' + properties.title + '" already exists');

		var glossary = extendWithMetadataForUpdate( properties );

		MyLog("collections/glossarys.js/updateGlossary/1", "properties", properties);

		Glossarys.update(_id, {$set: glossary} );

		// NOTIFICATION
//		if (! isAdmin(user)) {
//			var n = notificationFactory(MOVIE_UPDATED_BY_USER, "glossary", "admin", glossary.title, glossary.status, "/glossarys/"+_id, glossary.created);
//			Notifications.insert(n);
//		} else {
//			var m = Glossarys.findOne(_id);
//			var n = notificationFactory(MOVIE_UPDATED_BY_ADMIN, "glossary", m.userId, glossary.title, glossary.status, "/glossarys/"+_id, glossary.created);
//			Notifications.insert(n);
//		}
		return glossary;
	},

	deleteGlossary: function(glossaryId) {
		// remove associated stuff
		if(!this.isSimulation) {
//			GlossaryTimelines.remove({glossaryId: glossaryId});
//			Facts.remove({glossaryId: glossaryId});
		}

		// NOTIFICATION
//		if (isAdmin()) {
//			var m = Glossarys.findOne(glossaryId);
//			var n = notificationFactory(MOVIE_DELETED_BY_ADMIN, "glossary", m.userId, m.title, m.status, "/glossarys/"+glossaryId, getNow());
//			Notifications.insert(n);
//		}

		Glossarys.remove(glossaryId);
		return glossaryId;
	},

	addGlossaryFav: function(_id, userId){
		addFav(Glossarys, _id, userId);
	},
	deleteGlossaryFav: function(_id, userId){
		deleteFav(Glossarys, _id, userId);
	},

	addGlossarySeen: function(_id, userId){
		addSeen(Glossarys, _id, userId);
	},
	deleteGlossarySeen: function(_id, userId){
		deleteSeen(Glossarys, _id, userId);
	},

	addGlossaryStar: function(_id, userId){
		addStar(Glossarys, _id, userId);
	},
	deleteGlossaryStar: function(_id, userId){
		deleteStar(Glossarys, _id, userId);
	}

});
