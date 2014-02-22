Meteor.methods({
	/**
	 * update a user's permissions
	 *
	 * @param {Object} targetUserId Id of user to update
	 * @param {Array} roles User's new permissions
	 * @param {String} project_id to update permissions for
	 */
	updateRoles: function (targetUserId, roles, project_id) {
		var loggedInUser = Meteor.user();

		if ( !loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'], project_id)) {
			throw new Meteor.Error(403, "You must be an Administrator to perform this function");
		}

		Roles.setUserRoles(targetUserId, roles, project_id);
	},
	/**
	 * remove a user's permissions
	 *
	 * @param {Object} targetUserId Id of user to update
	 * @param {String} project_id to update permissions for
	 */
	removeRoles: function (targetUserId, project_id) {
		var loggedInUser = Meteor.user();
		console.log( targetUserId, project_id );

		if ( !loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'], project_id))
			throw new Meteor.Error(403, "You must be an Administrator to perform this function");
		if ( loggedInUser._id === targetUserId )
			throw new Meteor.Error(403, "You cannot remove you own role");

		var unset = {};
		unset["roles." + project_id] = "";
		Meteor.users.update(
			targetUserId,
			{$unset: unset }
		);
	},
	findPersons: function(text) {
		return Meteor.users.find( { 'profile.name': {$regex: text, $options: 'i'}, _id: {$ne: Meteor.userId()}, username: {$ne: 'cocoapuffs'} },
			{fields: { profile: 1 }, limit:10, sort: {"profile.name": 1} } ).fetch();
	}
});
