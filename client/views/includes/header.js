Template.tmplHeader.helpers({
	searchText: function() {
		return Session.get("search_text");
	},
	isAdmin: function() {
		return isAdmin();
	},
	hasNoSidebar: function() {
		return false;
		//return !Session.get('has_sidebar');
	},
	tdocs_count: function() {
		var stats = TdocsCount.findOne();
		return (stats) ? stats.count : 0;
	},
	glossarys_cnt: function() {
		var stats = GlossaryCount.findOne();
		return (stats) ? stats.count : 0;
	},
	diagrams_count: function() {
		var stats = DiagramsCount.findOne();
		return (stats) ? stats.count : 0;
	},
	tables_cnt: function() {
		var stats = TablesCount.findOne();
		return (stats) ? stats.count : 0;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmplHeader.events({
	// KEYUP SEARCH FIELD
	'keyup #header-search': function(e) {
		e.preventDefault();
		var value = String(e.target.value || "");
		var doTypeAheadSearch = false;

		/**
		 * do type-ahead search
		 * TODO
		 */
		if (doTypeAheadSearch) {
			searchRouteLogic();
		} else {
			/**
			 * no type-ahead.  just search on <enter>.
			 */
			doSearch(value, (e.which === 13));
		}
	},
	// SHOW SIDEBAR
	'click #show-sidebar': function(e, template) {
		e.preventDefault();
		Session.set('has_sidebar', true);
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
doSearch = function(value, isEnter) {
	if (!value || isEnter) {
		Session.set("search_text", value);
		searchRouteLogic();
	}
};