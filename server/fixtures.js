Meteor.startup(function () {
	/**
	 * Default Users
	 */
	// ADMIN
	var u = Meteor.users.findOne({username: "admin"}); // find the admin user
	if(!u)
		Accounts.createUser({username: "admin", password: "877669", profile: {name: "Stanley Kubrick"}});
	// John T Day
	u = Meteor.users.findOne({username: "johntday"}); // find John Day
	if(!u)
		Accounts.createUser({username: "johntday", password: "877669", profile: {name: "John T Day"}});

	/**
	 * Glossary
	 */
//	var glossary_cnt = Glossarys.find().count();
//	if ( glossary_cnt === 0 ) {
//		addGlossaryItems();
//	}
//
//	function addGlossaryItems() {
//		var data = [
//			{title: '', title_lc: '', description: ''}
//			,{title: '', description: ''}
//		];
//		_.each( data, function(glossary) {
//			Glossarys.insert( glossary );
//		});
//	}
});
