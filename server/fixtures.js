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

	var project_title = 'SAKS AP Integration';
	var project = Projects.findOne({title: project_title});
	var johntday = Meteor.users.findOne({username: "johntday"}); // find John Day
	var project_id = (project) ? project._id : null;
	if (!project) {
		project_id = Projects.insert(
			{
				type: TYPES.project
				, title: "SAKS AP Integration"
				, description: "SAKS AP Integration"
				, created: new Date().getTime()
				, userId: johntday._id
				, owner: johntday.username
				, status: STATUS_APPROVED
			}
		);

		Roles.addUsersToRoles(johntday._id, ['admin'], project_id);
	}

	var cnt = Nouns.find({project_id: project_id}).count();
	cnt = 1;
	if (cnt === 0) {
		nouns.forEach(function(noun){
			if (noun.class_name !== ea.class_name.External_Instance_Reference
			&& noun.class_name !== 'Taxonomy_Term'
			&& noun.class_name !== 'Geographic_Region'
			&& noun.class_name !== 'External_Instance_Reference'
			){
				Nouns.remove({instance_name: noun.instance_name});
				_.extend(noun, {project_id: project_id});
				extendWithMetadataForInsert(noun, johntday._id, johntday);
				Nouns.insert(noun);
				if (cnt++ % 100 === 0)
					console.log('noun '+ cnt + ' loaded');
			}
		});
		console.log('Finished loading: Noun cnt='+cnt);
	} else {
		console.log('Noun cnt='+cnt);
	}
});
