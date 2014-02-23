Accounts.onCreateUser(function(options, user) {

	var default_project_id = Projects.insert(
		{
			type: TYPES.project
			, title: "My First Project"
			, description: "Default project"
			, created: new Date().getTime()
			, userId: user._id
			, owner: user.username
			, status: STATUS_APPROVED
		}
	);
	user.roles = {};
	user.roles[default_project_id] =  ['admin'];

	// We still want the default hook's 'profile' behavior.
	if (options.profile)
		user.profile = options.profile;
	return user;
});
