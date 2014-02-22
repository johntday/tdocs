Persons = new Meteor.Collection('coll_persons');
/*------------------------------------------------------------------------------------------------------------------------------*/
// Create a collection where users can only modify documents that
// they own. Ownership is tracked by an 'userId' field on each
// document. All documents must be owned by the user (or userId='admin') that created
// them and ownership can't be changed. Only a document's owner (or userId='admin')
// is allowed to delete it, and the 'locked' attribute can be
// set on a document to prevent its accidental deletion.

Persons.allow({
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

Persons.deny({
	update: function (userId, docs, fields, modifier) {
		// can't change owners
		return _.contains(fields, 'userId');
	},
	remove: function (userId, doc) {
		// can't remove locked documents
		return doc.locked;
	},
	fetch: ['locked'] // no need to fetch 'userId'
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Meteor.methods({
	createPerson: function(properties){
		MyLog("collections/persons.js/createPerson/1", "properties", properties);
		var user = Meteor.user(),
			userId = getDocUserIdForSaving(properties, user),
			personId = '';

		if (!user)
			throw new Meteor.Error(601, 'You need to login to create a new person');
		if(!properties.name)
			throw new Meteor.Error(602, 'Please add a valid name');
		var personWithSameName = Persons.findOne( {name: {$regex: properties.name, $options: 'i'}} );

		if (personWithSameName)
			throw new Meteor.Error(603, 'Already have a person with name "' + properties.name + '"');

		var person = extendWithMetadataForInsert( properties, userId, user );

		MyLog("collections/persons.js/createPerson/2", "person", person);

		personId = Persons.insert(person);
		person.personId = personId;

		// NOTIFICATION
//		if (! isAdmin(user)) {
//			Notifications.insert({
//				event:'PERSON_ADD', userId: "admin", created: getNow(), personId: personId
//			});
//		}

		return person;
	},
	updatePerson: function(_id, properties){
		//TO-DO: make post_edit server-side?
	},
	clickedPerson: function(_id){
		Persons.update(_id, { $inc: { clicks: 1 }});
	},
	deletePerson: function(_id) {
		Persons.remove(_id);
	}
});
