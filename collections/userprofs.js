Userprofs = new Meteor.Collection('coll_userprofs');

STATUS_USERPROF_ACTIVE=1;
STATUS_USERPROF_INACTIVE=0;
/*------------------------------------------------------------------------------------------------------------------------------*/
// Create a collection where users can only modify documents that
// they own. Ownership is tracked by an 'userId' field on each
// document. All documents must be owned by the user (or userId='admin') that created
// them and ownership can't be changed. Only a document's owner (or userId='admin')
// is allowed to delete it, and the 'locked' attribute can be
// set on a document to prevent its accidental deletion.

Userprofs.allow({
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

Userprofs.deny({
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
	createUserprof: function(properties){
		MyLog("collections/persons.js/createUserprof/1", "properties", properties);
		var user = Meteor.user(),
			userId = getDocUserIdForSaving(properties, user),
			personId = '';

		if (!user)
			throw new Meteor.Error(601, 'You need to login to create a new person');
		if(!properties.name)
			throw new Meteor.Error(602, 'Please add a valid name');
		var personWithSameName = Userprofs.findOne( {name: {$regex: properties.name, $options: 'i'}} );

		if (personWithSameName)
			throw new Meteor.Error(603, 'Already have a person with name "' + properties.name + '"');

		var person = _.extend(properties, {
			userId: userId,
			author: getUserDisplayName(user),
			created: getNow(),
			status: (isAdmin(user)) ? STATUS_APPROVED : STATUS_PENDING
		});

		MyLog("collections/persons.js/createUserprof/2", "person", person);

		personId = Userprofs.insert(person);
		person.personId = personId;

		// NOTIFICATION
//		if (! isAdmin(user)) {
//			Notifications.insert({
//				event:'PERSON_ADD', userId: "admin", created: getNow(), personId: personId
//			});
//		}

		return person;
	},
	updateUserprof: function(_id, properties){
		//TO-DO: make post_edit server-side?
	},
	clickedUserprof: function(_id){
		Userprofs.update(_id, { $inc: { clicks: 1 }});
	},
	deleteUserprof: function(_id) {
		Userprofs.remove(_id);
	}
});
