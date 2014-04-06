ownsDocument = function(userId, doc) {
	return (userId && doc && doc.userId === userId);
};
ownsDocumentOrAdmin = function(userId, doc) {
	return (ownsDocument(userId, doc) || isAdmin);
};
canEdit = function(user, doc){
	var user=(typeof user === 'undefined') ? Meteor.user() : user;

	if (!user){
		return false;
	} else if ( Roles.userIsInRole(user._id, ['admin','edit'], getProjectId()) ) {
		return true;
	} else if (isAdmin(user)) {
		return true;
	} else {
		return false;
	}
};
canCreate = function(user) {
	return ( user && Roles.userIsInRole(user._id, ['admin','edit'], getProjectId()) );
};
canRead = function(user) {
	return ( user && Roles.userIsInRole(user._id, ['admin','edit','read'], getProjectId()) );
};
isAdmin = function(user) {
	var u=(typeof user === 'undefined') ? Meteor.user() : user;
	return (u && (u.username === "cocoapuffs" || u.username === "johntday"));
};
canEditById = function(userId, doc){
	return ( userId && Roles.userIsInRole(userId, ['admin','edit'], getProjectId()) );
};
canEditAndEditToggle = function(doc) {
	return canEdit(Meteor.user(), doc) && Session.get('form_update');
};
isAdminAndEditToggle = function() {
	return isAdmin(Meteor.user()) && Session.get('form_update');
};
showEditButton = function(doc) {
	return canEdit(Meteor.user(), doc) && !Session.get('form_update');
};
