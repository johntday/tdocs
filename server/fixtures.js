Meteor.startup(function () {
	/**
	 * Default Users
	 */
	// ADMIN
	var u = Meteor.users.findOne({username: "admin"}); // find the admin user
	if(!u)
		Accounts.createUser({username: "admin", password: "cocoapuffs", profile: {name: "Stanley Kubrick"}});
	// Ben Venker
	u = Meteor.users.findOne({username: "bvenker"}); // find Ben Venker
	if(!u)
		Accounts.createUser({username: "bvenker", password: "cocoapuffs", profile: {name: "Ben Venker"}});
	// John T Day
	u = Meteor.users.findOne({username: "johntday"}); // find John Day
	if(!u)
		Accounts.createUser({username: "johntday", password: "cocoapuffs", profile: {name: "John T Day"}});

});
