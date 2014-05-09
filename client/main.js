/**
 * SESSION VARIABLE DEFAULTS
 */
Session.setDefault('paging', {page_size: 5, current_page: 1});
Session.setDefault('has_sidebar', false);
Session.setDefault('sidebar_nbr', 3);
Session.setDefault('search_text', '');
Session.setDefault('form_update', false);
Session.setDefault('selected_person_id', null);
Session.setDefault('breadcrumbs', null);
Session.setDefault('person_sort', 'name');

Session.setDefault('selected_tdoc_id', null);
Session.setDefault('selected_diagram_id', null);
//Session.setDefault('selected_tree_noun', {_id: null, class_name: null, type: null, parent_id: null});

Session.setDefault('tdoc_sort', 'title');
Session.setDefault('diagram_sort', 'title');
Session.setDefault('glossary_sort', 'title');
Session.setDefault('table_sort', 'title');
Session.setDefault('project_sort', 'title');
Session.setDefault('noun_sort', 'title');

selectedTreeItemDep = new Deps.Dependency;
accordian = {open: 'busLayer', ids: ['comLayer', 'busLayer', 'appLayer', 'techLayer', 'modvLayer', 'implLayer']};
sidebar = {};
var class_names = _.keys(ea.classBelongsToArea);
class_names.forEach(function(class_name){
	sidebar[class_name] = null;
});
var selected_tree_noun = {_id: null, title: null, area_code: null, class_name: null, type: null, parent_id: null};
getSelectedTreeItem = function(full) {
	selectedTreeItemDep.depend();
	var selected = selected_tree_noun;
	if (full) {
		var handle =  sidebar[selected.class_name];
		if (handle) {
			var treeArray = handle.get_selected(true);
			return (treeArray && treeArray.length>0) ? treeArray[0] : {};
		} else
			return growl("Cannot find item for "+selected);
	}
	return selected;
};
setSelectedTreeItem = function(item) {
	Session.setDefault('noun_id', item._id);
	var list = _.pairs(sidebar);
	_.each(list, function(obj){
		(obj[0] === item.class_name) ? obj[1].select_node(item._id) : obj[1].deselect_all(true);
	});
	selected_tree_noun = item;

	openAccordianOfSelected(item);
	selectedTreeItemDep.changed();
};
/*------------------------------------------------------------------------------------------------------------------------------*/
/**
 * Tdocs
 */
tdocListSubscription = function(query, options, per_page) {
	options = options || {};
	options.limit = per_page;
	return Tdocs.find(query || {}, options);
};
	tdocsHandle = tdocListSubscription(
		tdocQuery( Session.get('search_text') ),
		tdocSort[ Session.get('tdoc_sort') ],
		Meteor.MyClientModule.appConfig.pageLimit
	);

/**
 * Diagrams
 */
diagramListSubscription = function(query, options, per_page) {
	options = options || {};
	options.limit = per_page;
	return Diagrams.find(query || {}, options);
};
	diagramsHandle = diagramListSubscription(
		diagramQuery( Session.get('search_text') ),
		diagramSort[ Session.get('diagram_sort') ],
		Meteor.MyClientModule.appConfig.pageLimit
	);

/**
 * Glossary
 */
glossaryListSubscription = function(query, options, per_page) {
	options = options || {};
	options.limit = per_page;
	return Glossarys.find(query || {}, options);
};
	glossarysHandle = glossaryListSubscription(
		glossaryQuery( Session.get('search_text') ),
		glossarySort[ Session.get('glossary_sort') ],
		Meteor.MyClientModule.appConfig.pageLimit
	);

/**
 * Table
 */
tableListSubscription = function(query, options, per_page) {
	options = options || {};
	options.limit = per_page;
	return Tables.find(query || {}, options);
};
	tablesHandle = tableListSubscription(
		tableQuery( Session.get('search_text') ),
		tableSort[ Session.get('table_sort') ],
		Meteor.MyClientModule.appConfig.pageLimit
	);

/**
 * Project
 */
projectListSubscription = function(query, options, per_page) {
//	var handle = Meteor.subscribeWithPagination('pubsub_project_list', query, options, per_page);
	options = options || {};
	options.limit = per_page;
	var handle = Projects.find(query || {}, options);
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
//TdocsCount = new Meteor.Collection('tdocs_cnt');
//GlossaryCount = new Meteor.Collection('glossarys_cnt');
//DiagramsCount = new Meteor.Collection('diagrams_cnt');
//TablesCount = new Meteor.Collection('tables_cnt');
//Meteor.subscribe('pubsub_stats_glossarys_cnt');
//Meteor.subscribe('pubsub_stats_tdocs_cnt');
//Meteor.subscribe('pubsub_stats_diagrams_cnt');
//Meteor.subscribe('pubsub_stats_tables_cnt');

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
		return false;
	},
	sidebarNbr: function() {
		return Session.get('sidebar_nbr');
	},
	mainNbr: function() {
		return 12 - Session.get('sidebar_nbr');
	},
	pickedProject: function() {
		return !!getProjectId();
	}
});
