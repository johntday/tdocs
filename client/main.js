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

Session.setDefault('tdoc_sort', 'title');
Session.setDefault('diagram_sort', 'title');
Session.setDefault('glossary_sort', 'title');
Session.setDefault('table_sort', 'title');
Session.setDefault('project_sort', 'title');

sidebar = {bus_capabilities: null, openAccordian: 'busLayer'
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
 * Business Capabilities
 */
BusCapListSubscription = function() {
	var root = Nouns.findOne({class_name: ea.class_name.Business_Capability, business_capability_level:"-1"});
	function treeData( noun ) {
		var descendants=[]
		var stack=[];
		var item = Nouns.findOne({instance_name:noun.instance_name});
		stack.push(item);
		while (stack.length>0){
			var currentnode = stack.pop();
			_.extend(currentnode, {id: currentnode._id, text:currentnode.title});
			var children = [];
			if (currentnode && currentnode.contained_business_capabilities)
				children = Nouns.find({instance_name:{$in:currentnode.contained_business_capabilities}}).fetch();

			children.forEach(function(child) {
				_.extend(child, {id: child._id, text:child.title});
				descendants.push(child);
				if(child && child.contained_business_capabilities && child.contained_business_capabilities.length>0){
					stack.push(child);
				}
			});
			_.extend(currentnode, {children: children});
		}

		// remove extra attributes
		var itemFlatten = _.flatten(item);
		itemFlatten.map(mapToTree);

		return item;
	}
	return treeData(root);
};

BusCapsHandle = BusCapListSubscription();

function mapToTree(noun) {
	if (!noun.type)
		return {id:noun._id, text:noun.title, children:noun.children};
	else
		return {id:noun._id, text:noun.title, type: noun.type, children:noun.children};
}

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
		return _.contains(['/tables/'], Location._state.path);
	},
	sidebarNbr: function() {
		return Session.get('sidebar_nbr');
	},
	mainNbr: function() {
		return 12 - Session.get('sidebar_nbr');
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
