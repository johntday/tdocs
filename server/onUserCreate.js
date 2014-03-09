Accounts.onCreateUser(function(options, user) {

	if (!options)
		options = {};
	if (!options.profile)
		options.profile = {};
	if (!options.profile.name)
		options.profile.name = user.username;


	// SETUP ACCESS TO "SAKS AP" PROJECT
	user.roles = {};
	var project_title = 'SAKS AP Integration';
	var project = Projects.findOne({title: project_title});
	if (project)
		user.roles[project._id] =  ['admin'];


	// We still want the default hook's 'profile' behavior.
	if (options.profile)
		user.profile = options.profile;
	return user;
});
