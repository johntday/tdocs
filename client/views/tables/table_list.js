Template.tmpl_tables.helpers({
	tables: function() {
		return tablesHandle;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_tables_sort_select.helpers({
	breadcrumbs: function() {
		return [
			{title:"home", link:"/", isActive:false},
			{title:"Tables", link:"/tables", isActive:true}
		];
	},
	option_value: function() {
		return Session.get('table_sort');
	},
	options: function() {
		return getTableSortingOptions();
	}
});
Template.tmpl_tables_sort_select.events({
	'click #table-sort': function(e) {
		e.preventDefault();
		var $selector = $('#table-sort');
		if ( Session.get('table_sort') !== $selector.val() ) {
			Session.set('table_sort', $selector.val());
			Router.go('/tables');
		}
		$selector = null;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
