Tables = new Meteor.Collection('coll_tables');
/*------------------------------------------------------------------------------------------------------------------------------*/
// Create a collection where users can only modify documents that
// they own. Ownership is tracked by an 'userId' field on each
// document. All documents must be owned by the user (or userId='admin') that created
// them and ownership can't be changed. Only a document's owner (or userId='admin')
// is allowed to delete it, and the 'locked' attribute can be
// set on a document to prevent its accidental deletion.

Tables.allow({
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

Tables.deny({
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
	createTable: function(properties){
		MyLog("collections/tables.js/createTable/1", "properties", properties);
		var user = Meteor.user();
		var userId = getDocUserIdForSaving(properties, user);
		//var tableWithSameTitle = Tables.findOne( {title: {$regex: table.title, $options: 'i'}} );
		var tableId = '';

		if (!user)
			throw new Meteor.Error(601, 'You need to login to create a new table');
		if(!properties.title)
			throw new Meteor.Error(602, 'Please add a title');

		var table = extendWithMetadataForInsert( properties, userId, user );

		MyLog("collections/tables.js/createTable/2", "table", table);

		tableId = Tables.insert(table);
		table.tableId = tableId;

		// NOTIFICATION
//		if (! isAdmin(user)) {
//			var n = notificationFactory(MOVIE_CREATED_BY_USER, "table", "admin", table.title, table.status, "/tables/"+tableId, table.created);
//			Notifications.insert(n);
//		}

		return table;
	},

	updateTable: function(_id, properties){
		var user = Meteor.user();

		if (!user)
			throw new Meteor.Error(601, 'You need to login to update a table');
		if(!properties.title)
			throw new Meteor.Error(602, 'Please add a title');

		var table = extendWithMetadataForUpdate( properties );

		MyLog("collections/tables.js/updateTable/1", "properties", properties);

		Tables.update(_id, {$set: table} );

		// NOTIFICATION
//		if (! isAdmin(user)) {
//			var n = notificationFactory(MOVIE_UPDATED_BY_USER, "table", "admin", table.title, table.status, "/tables/"+_id, table.created);
//			Notifications.insert(n);
//		} else {
//			var m = Tables.findOne(_id);
//			var n = notificationFactory(MOVIE_UPDATED_BY_ADMIN, "table", m.userId, table.title, table.status, "/tables/"+_id, table.created);
//			Notifications.insert(n);
//		}
		return table;
	},

	deleteTable: function(tableId) {
		// remove associated stuff
		if(!this.isSimulation) {
//			TableTimelines.remove({tableId: tableId});
//			Facts.remove({tableId: tableId});
		}

		// NOTIFICATION
//		if (isAdmin()) {
//			var m = Tables.findOne(tableId);
//			var n = notificationFactory(MOVIE_DELETED_BY_ADMIN, "table", m.userId, m.title, m.status, "/tables/"+tableId, getNow());
//			Notifications.insert(n);
//		}

		Tables.remove(tableId);
		return tableId;
	}


});
