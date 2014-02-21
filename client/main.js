/**
 * SESSION VARIABLE DEFAULTS
 */
Session.setDefault('namespace', 'default');
Session.setDefault('has_sidebar', false);
Session.setDefault('search_text', '');
Session.setDefault('form_update', false);
Session.setDefault('selected_person_id', null);
Session.setDefault('breadcrumbs', null);
Session.setDefault('person_sort', 'name');

Session.setDefault('selected_tdoc_id', null);
Session.setDefault('selected_diagram_id', null);

Session.setDefault('tdoc_sort', 'title');
Session.setDefault('diagram_sort', 'title');
Session.setDefault('glossary_sort', 'title');
Session.setDefault('table_sort', 'title');
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
 * Table
 */
tableListSubscription = function(find, options, per_page) {
	var handle = Meteor.subscribeWithPagination('pubsub_table_list', find, options, per_page);
	handle.fetch = function() {
		var ourFind = _.isFunction(find) ? find() : find;
		return limitDocuments(Tables.find(ourFind, options), handle.loaded());
	}
	return handle;
};
Deps.autorun(function(){
	tablesHandle = tableListSubscription(
		tableQuery( Session.get('search_text') ),
		tableSort[ Session.get('table_sort') ],
		Meteor.MyClientModule.appConfig.pageLimit
	);
});

/**
 * Project
 */
projectListSubscription = function(find, options, per_page) {
	var handle = Meteor.subscribeWithPagination('pubsub_project_list', find, options, per_page);
	handle.fetch = function() {
		var ourFind = _.isFunction(find) ? find() : find;
		return limitDocuments(Projects.find(ourFind, options), handle.loaded());
	}
	return handle;
};
Deps.autorun(function(){
	projectsHandle = projectListSubscription(
		projectQuery( Session.get('search_text') ),
		projectSort[ Session.get('project_sort') ],
		Meteor.MyClientModule.appConfig.pageLimit
	);
});

/**
 * Stats
 */
TdocsCount = new Meteor.Collection('tdocs_cnt');
GlossaryCount = new Meteor.Collection('glossarys_cnt');
DiagramsCount = new Meteor.Collection('diagrams_cnt');
TablesCount = new Meteor.Collection('tables_cnt');
ProjectsCount = new Meteor.Collection('projects_cnt');
Meteor.subscribe('pubsub_stats_glossarys_cnt');
Meteor.subscribe('pubsub_stats_tdocs_cnt');
Meteor.subscribe('pubsub_stats_diagrams_cnt');
Meteor.subscribe('pubsub_stats_tables_cnt');
Meteor.subscribe('pubsub_stats_projects_cnt');

/**
 * layout template JS
 */
Template.layout.helpers({
	hasSidebar: function() {
		return Session.get('has_sidebar');
	},
	mainDivClass: function() {
		return (Session.get('has_sidebar')) ? "col-sm-8" : "col-sm-12";
	},
	showFooter: function() {
		return _.contains(['/tables/'], Location._state.path);
	}
});

//function RESIZE() {
//	var w = $(window).width();
//	var h = $(window).height();
//	Session.set('size', {w:w, h:h} );
//	console.log('resize: '+ JSON.stringify(Session.get('size')));
//};
//$( window ).resize(function() {
//	RESIZE()
//});
//RESIZE();

/*
 * set debug=true in "/lib/client_module.js" to log template render counts to console.
 * Set as last statement in "main.js"
 */
//Meteor.MyClientModule.performanceLogRenders();
