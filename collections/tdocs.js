Tdocs = new Meteor.Collection('coll_tdocs');

STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;
/*------------------------------------------------------------------------------------------------------------------------------*/
// Create a collection where users can only modify documents that
// they own. Ownership is tracked by an 'userId' field on each
// document. All documents must be owned by the user (or userId='admin') that created
// them and ownership can't be changed. Only a document's owner (or userId='admin')
// is allowed to delete it, and the 'locked' attribute can be
// set on a document to prevent its accidental deletion.

Tdocs.allow({
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

Tdocs.deny({
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
	createTdoc: function(properties){
		MyLog("collections/tdocs.js/createTdoc/1", "properties", properties);
		var user = Meteor.user();
		var userId = getDocUserIdForSaving(properties, user);
		//var tdocWithSameTitle = Tdocs.findOne( {title: {$regex: tdoc.title, $options: 'i'}} );
		var tdocId = '';

		if (!user)
			throw new Meteor.Error(601, 'You need to login to create a new tdoc');
		if(!properties.title)
			throw new Meteor.Error(602, 'Please add a title');

		var tdoc = extendWithMetadataForInsert( properties, userId, user );

		MyLog("collections/tdocs.js/createTdoc/2", "tdoc", tdoc);

		tdocId = Tdocs.insert(tdoc);
		tdoc.tdocId = tdocId;

		// NOTIFICATION
//		if (! isAdmin(user)) {
//			var n = notificationFactory(MOVIE_CREATED_BY_USER, "tdoc", "admin", tdoc.title, tdoc.status, "/tdocs/"+tdocId, tdoc.created);
//			Notifications.insert(n);
//		}

		return tdoc;
	},

	updateTdoc: function(_id, properties){
		var user = Meteor.user();

		if (!user)
			throw new Meteor.Error(601, 'You need to login to update a tdoc');
		if(!properties.title)
			throw new Meteor.Error(602, 'Please add a title');

		var tdoc = extendWithMetadataForUpdate( properties );

		MyLog("collections/tdocs.js/updateTdoc/1", "properties", properties);

		Tdocs.update(_id, {$set: tdoc} );

		// NOTIFICATION
//		if (! isAdmin(user)) {
//			var n = notificationFactory(MOVIE_UPDATED_BY_USER, "tdoc", "admin", tdoc.title, tdoc.status, "/tdocs/"+_id, tdoc.created);
//			Notifications.insert(n);
//		} else {
//			var m = Tdocs.findOne(_id);
//			var n = notificationFactory(MOVIE_UPDATED_BY_ADMIN, "tdoc", m.userId, tdoc.title, tdoc.status, "/tdocs/"+_id, tdoc.created);
//			Notifications.insert(n);
//		}
		return tdoc;
	},

	deleteTdoc: function(tdocId) {
		// remove associated stuff
		if(!this.isSimulation) {
//			TdocTimelines.remove({tdocId: tdocId});
//			Facts.remove({tdocId: tdocId});
		}

		// NOTIFICATION
//		if (isAdmin()) {
//			var m = Tdocs.findOne(tdocId);
//			var n = notificationFactory(MOVIE_DELETED_BY_ADMIN, "tdoc", m.userId, m.title, m.status, "/tdocs/"+tdocId, getNow());
//			Notifications.insert(n);
//		}

		Tdocs.remove(tdocId);
		return tdocId;
	},

	addFavUser: function(_id, userId){
		Tdocs.update(_id,
			{ $addToSet: { favs: userId }, $inc: { favs_cnt: 1 } }
		);
	},
	deleteFavUser: function(_id, userId){
		Tdocs.update(_id,
			{ $pull: { favs: userId }, $inc: { favs_cnt: -1 } }
		);
	},

	addSeenUser: function(_id, userId){
		Tdocs.update(_id,
			{ $addToSet: { seen: userId }, $inc: { seen_cnt: 1 } }
		);
	},
	deleteSeenUser: function(_id, userId){
		Tdocs.update(_id,
			{ $pull: { seen: userId }, $inc: { seen_cnt: -1 } }
		);
	}

});
