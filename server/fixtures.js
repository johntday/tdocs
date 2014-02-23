Meteor.startup(function () {
	var admin_username = "cocoapuffs";

	// ADMIN
	var admin_id;
	var admin = Meteor.users.findOne({username: admin_username}); // find the admin user
	if(!admin)
		admin_id = Accounts.createUser({username: admin_username, password: "877669", email:"john.day@daugherty.com", profile: {name: "Administrator"}});

	// John T Day
	var u = Meteor.users.findOne({username: "johntday"}); // find John Day
	if(!u)
		Accounts.createUser({username: "johntday", password: "877669", email:"johntday@gmail.com", profile: {name: "John T Day"}});

	// TEST USERS
	for (var i=0; i < 5; i++) {
		u = Meteor.users.findOne({username: "test"+i});
		if(!u)
			Accounts.createUser({username: "test"+i, password: "877669", email:"test"+i+"@gmail.com", profile: {name: "test"+i}});
	}

	/**
	 * ROLES
	 */
	u = Meteor.users.findOne({username: admin_username});
	if (u)
		Roles.addUsersToRoles(u._id, ['admin'], Roles.GLOBAL_GROUP);

	if(!Meteor.roles.findOne({name: "read"}))
		Roles.createRole("read");

	if(!Meteor.roles.findOne({name: "author"}))
		Roles.createRole("author");

});
