/*------------------------------------------------------------------------------------------------------------------------------*/
// Create a collection where users can only modify documents that
// they own. Ownership is tracked by an 'userId' field on each
// document. All documents must be owned by the user (or userId='admin') that created
// them and ownership can't be changed. Only a document's owner (or userId='admin')
// is allowed to delete it, and the 'locked' attribute can be
// set on a document to prevent its accidental deletion.

Diagrams.allow({
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

Diagrams.deny({
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
	createDiagram: function(properties){
		var user = Meteor.user();
		var userId = user._id;
		//var diagramWithSameTitle = Diagrams.findOne( {title: {$regex: diagram.title, $options: 'i'}} );

		if (!user)
			throw new Meteor.Error(601, 'You need to login to create a new diagram');
		if(!properties.title)
			throw new Meteor.Error(602, 'Please add a title');
		if(!properties.project_id)
			throw new Meteor.Error(602, 'Must select a project first');

		var diagram = extendWithMetadataForInsert( properties, userId, user );
		diagram.description = diagram.description || diagram.title;

		var diagramId = Diagrams.insert(diagram);
		diagram.diagramId = diagramId;

		// NOTIFICATION
//		if (! isAdmin(user)) {
//			var n = notificationFactory(MOVIE_CREATED_BY_USER, "diagram", "admin", diagram.title, diagram.status, "/diagrams/"+diagramId, diagram.created);
//			Notifications.insert(n);
//		}

		return diagram;
	},

	updateDiagram: function(_id, properties){
		var user = Meteor.user();

		if (!user)
			throw new Meteor.Error(601, 'You need to login to update a diagram');

		var diagram = _.extend(properties, {
			updated: getNow()
		});

		Diagrams.update(_id, {$set: diagram} );

		// NOTIFICATION
//		if (! isAdmin(user)) {
//			var n = notificationFactory(MOVIE_UPDATED_BY_USER, "diagram", "admin", diagram.title, diagram.status, "/diagrams/"+_id, diagram.created);
//			Notifications.insert(n);
//		} else {
//			var m = Diagrams.findOne(_id);
//			var n = notificationFactory(MOVIE_UPDATED_BY_ADMIN, "diagram", m.userId, diagram.title, diagram.status, "/diagrams/"+_id, diagram.created);
//			Notifications.insert(n);
//		}
		return diagram;
	},

	deleteDiagram: function(diagramId) {
		// remove associated stuff
		if(!this.isSimulation) {
//			DiagramTimelines.remove({diagramId: diagramId});
//			Facts.remove({diagramId: diagramId});
		}

		// NOTIFICATION
//		if (isAdmin()) {
//			var m = Diagrams.findOne(diagramId);
//			var n = notificationFactory(MOVIE_DELETED_BY_ADMIN, "diagram", m.userId, m.title, m.status, "/diagrams/"+diagramId, getNow());
//			Notifications.insert(n);
//		}

		Diagrams.remove(diagramId);
		return diagramId;
	}

});
