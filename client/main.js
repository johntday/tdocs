/**
 * SESSION VARIABLE DEFAULTS
 */
Session.setDefault('namespace', 'default');
Session.setDefault('has_sidebar', true);
Session.setDefault('search_text', '');
Session.setDefault('form_update', false);
Session.setDefault('selected_person_id', null);
Session.setDefault('breadcrumbs', null);
Session.setDefault('person_sort', 'name');

Session.setDefault('tdoc_sort', 'title');
Session.setDefault('selected_tdoc_id', null);

Session.setDefault('diagram_sort', 'title');
Session.setDefault('selected_diagram_id', null);
/*------------------------------------------------------------------------------------------------------------------------------*/
/**
 * Tdocs
 */
tdocListSubscription = function(find, options, per_page) {
	var handle = Meteor.subscribeWithPagination('pubsub_tdoc_list', find, options, per_page);
	handle.fetch = function() {
		var ourFind = _.isFunction(find) ? find() : find;
		return limitDocuments(Tdocs.find(ourFind, options), handle.loaded());
	}
	return handle;
};
Deps.autorun(function(){
	tdocsHandle = tdocListSubscription(
		tdocQuery( Session.get('search_text') ),
		tdocSort[ Session.get('tdoc_sort') ],
		Meteor.MyClientModule.appConfig.pageLimit
	);
});

/**
 * Diagrams
 */
diagramListSubscription = function(find, options, per_page) {
	var handle = Meteor.subscribeWithPagination('pubsub_diagram_list', find, options, per_page);
	handle.fetch = function() {
		var ourFind = _.isFunction(find) ? find() : find;
		return limitDocuments(Diagrams.find(ourFind, options), handle.loaded());
	}
	return handle;
};
Deps.autorun(function(){
	diagramsHandle = diagramListSubscription(
		diagramQuery( Session.get('search_text') ),
		diagramSort[ Session.get('diagram_sort') ],
		Meteor.MyClientModule.appConfig.pageLimit
	);
});

/**
 * Persons
 */
personListSubscription = function(find, options, per_page) {
	var handle = Meteor.subscribeWithPagination('pubsub_person_list', find, options, per_page);
	handle.fetch = function() {
		var ourFind = _.isFunction(find) ? find() : find;
		return limitDocuments(Persons.find(ourFind, options), handle.loaded());
	}
	return handle;
};
Deps.autorun(function(){
	personsHandle = personListSubscription(
		personQuery( Session.get('search_text') ),
		personSort[ Session.get('person_sort') ],
		Meteor.MyClientModule.appConfig.pageLimit
	);
});

/**
 * Glossary
 */
glossaryListSubscription = function(find, options, per_page) {
	var handle = Meteor.subscribeWithPagination('pubsub_glossary_list', find, options, per_page);
	handle.fetch = function() {
		var ourFind = _.isFunction(find) ? find() : find;
		return limitDocuments(Glossarys.find(ourFind, options), handle.loaded());
	}
	return handle;
};
Deps.autorun(function(){
	glossarysHandle = glossaryListSubscription(
		glossaryQuery( Session.get('search_text') ),
		glossarySort[ Session.get('glossary_sort') ],
		Meteor.MyClientModule.appConfig.pageLimit
	);
});

/**
 * Stats
 */
TdocsCount = new Meteor.Collection('stats');
Meteor.subscribe('stats');
//Meteor.startup(function() {
//	return Meteor.setInterval((function() {
//		var uc = MoviesCount.findOne();
//		return console.log(uc.count || 0);
//	}), 1000);
//});

/**
 * layout template JS
 */
Template.layout.helpers({
	hasSidebar: function() {
		return Session.get('has_sidebar');
	},
	mainDivClass: function() {
		return (Session.get('has_sidebar')) ? "col-sm-8" : "col-sm-12";
	}
});

/*
 * set debug=true in "/lib/client_module.js" to log template render counts to console.
 * Set as last statement in "main.js"
 */
Meteor.MyClientModule.performanceLogRenders();
