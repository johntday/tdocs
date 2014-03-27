Template.tmpl_tdocs.helpers({
	tdocs: function() {
		return tdocsHandle;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_tdocs_sort_select.helpers({
	breadcrumbs: function() {
		return [
			{title:"home", link:"/", isActive:false},
			{title:"Tdocs", link:"/tdocs", isActive:true}
		];
	},
	option_value: function() {
		return Session.get('tdoc_sort');
	},
	options: function() {
		return getTdocSortingOptions();
	}
});
Template.tmpl_tdocs_sort_select.events({
	'click #tdoc-sort': function(e) {
		e.preventDefault();
		var $selector = $('#tdoc-sort');
		if ( Session.get('tdoc_sort') !== $selector.val() ) {
			Session.set('tdoc_sort', $selector.val());
			Router.go('/tdocs');
		}
		$selector = null;
	},
	'click button.btn.btn-success.btn-sm': function(e) {
		Router.go('/tdocAdd');
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
