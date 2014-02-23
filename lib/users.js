getUserDisplayName = function(user){
	return (user.profile && user.profile.name) ? user.profile.name : user.username;
};
getDocUserIdForSaving = function(doc, user) {
	return doc.userId || ((isAdmin(user)) ? "admin" : user._id);
};
getUserProjects = function() {
	var u = Meteor.user();
	if (!u) return [];
	return _.keys(u.roles);
};