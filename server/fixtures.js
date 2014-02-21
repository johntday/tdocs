Meteor.startup(function () {
	/**
	 * Default Users
	 */
	// ADMIN
	var u = Meteor.users.findOne({username: "admin"}); // find the admin user
	if(!u)
		Accounts.createUser({username: "admin", password: "877669", email:"john.day@daugherty.com", profile: {name: "Administrator"}});
	// John T Day
	u = Meteor.users.findOne({username: "johntday"}); // find John Day
	if(!u)
		Accounts.createUser({username: "johntday", password: "877669", email:"johntday@gmail.com", profile: {name: "John T Day"}});

	/**
	 * ROLES
	 */
	u = Meteor.users.findOne({username: "admin"});
	if (u)
		Roles.addUsersToRoles(u._id, ['admin']);

	if(!Meteor.roles.findOne({name: "read"}))
		Roles.createRole("read");

	if(!Meteor.roles.findOne({name: "author"}))
		Roles.createRole("author");

});
