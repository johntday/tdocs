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
		var project = Projects.findOne(project_id);

		if ( !loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'], project_id))
			throw new Meteor.Error(403, "You must be an Administrator to perform this function");
		if ( loggedInUser._id === targetUserId )
			throw new Meteor.Error(403, "You cannot remove you own role");
		if ( project.userId === targetUserId )
			throw new Meteor.Error(403, "You cannot remove role for the project owner");

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
	},

	updateUserProject: function(project) {
		var loggedInUser = Meteor.user();
		if (!loggedInUser)
			return;
		if (!project)
			project = {_id: '', title: '', userId: ''};
		else
			project = _.pick(project, '_id', 'title', 'userId');

		Meteor.users.update(loggedInUser._id, {$set: {project: project } } );
	},

	updateUserprof: function(properties) {
//		if(!this.isSimulation) {
			console.log(properties);
			var loggedInUser = Meteor.user();
			if ( !loggedInUser )
				throw new Meteor.Error(403, "You must logged in to change your profile");

			//Meteor.users.update({_id:loggedInUser._id}, {$set:{"emails":[{address:properties.email, verified:false}], "profile.name": properties.name } } );
			Meteor.users.update({_id:loggedInUser._id}, {$set:{"profile.name": properties.name } } );
//		}
	}


});
