Accounts.onCreateUser(function(options, user) {

	if (!options)
		options = {};
	if (!options.profile)
		options.profile = {};
	if (!options.profile.name)
		options.profile.name = user.username;


	// SETUP ACCESS TO "SAKS AP" PROJECT
	user.roles = {};
	var project_title = 'Basic';
	var project = Projects.findOne({title: project_title, owner:'John T Day'});
	if (project)
		user.roles[project._id] =  ['read'];


	// We still want the default hook's 'profile' behavior.
	if (options.profile)
		user.profile = options.profile;
	return user;
});
