ownsDocument = function(userId, doc) {
	return (userId && doc && doc.userId === userId);
};
ownsDocumentOrAdmin = function(userId, doc) {
	return (ownsDocument(userId, doc) || isAdmin);
};
canEdit = function(user, doc){
	var user=(typeof user === 'undefined') ? Meteor.user() : user;

	if (!user || !doc){
		return false;
	} else if (isAdmin(user)) {
		return true;
	} else if (user._id!==doc.userId) {
		return false;
	}else {
		return true;
	}
};
canCreate = function(user) {
	return (user != null);
};
isAdmin = function(user) {
	var u=(typeof user === 'undefined') ? Meteor.user() : user;
	return (u && u.username === "admin");
};
canEditById = function(userId, doc){
	return userId && doc && (userId===doc.userId || isAdmin);
};
getUserIdOrAdmin = function() {
	var u = Meteor.user();
	if (!u)
		return null;
	return (isAdmin(u)) ? "admin" : u._id;
};
