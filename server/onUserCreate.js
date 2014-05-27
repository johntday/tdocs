Accounts.onCreateUser(function(options, user) {

	if (!options)
		options = {};
	if (!options.profile)
		options.profile = {};
	if (!options.profile.name)
		options.profile.name = user.username;


	// SETUP ACCESS TO sample projects
	user.roles = {};

	// Basic
	var project_title = 'Basic';
	var project_owner = 'John T Day';
	var project = Projects.findOne({title: project_title, owner:project_owner});
	if (project)
		user.roles[project._id] =  ['read'];

	// Basic
	project_title = 'Sample Project';
	project = Projects.findOne({title: project_title, owner:project_owner});
	if (project)
		user.roles[project._id] =  ['read'];


	// We still want the default hook's 'profile' behavior.
	if (options.profile)
		user.profile = options.profile;
	return user;
});
