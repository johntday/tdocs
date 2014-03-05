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



	var nouns = [
		{
			instance_name: 'eas_framework_example_v3.7.1_Instance_10000',
			class_name: 'Technology_Product',

			'external_repository_instance_reference': 'essential_baseline_v3.5_Class21788',
			'implements_technology_components': [
				'essential_prj_DD_v1.1_Instance_90025',
				'essential_prj_DD_v1.1_Instance_90026'],
			'title': 'Application Server',
			'product_label': 'JBoss::Application Server',
			'supplier_technology_product': 'essential_prj_DD_v1.1_Instance_34'
		}
	];

	nouns.forEach(function(noun){
		if ( !Nouns.findOne({instance_name: noun.instance_name}) ) {
			Nouns.insert(noun);
		}
	});
});
