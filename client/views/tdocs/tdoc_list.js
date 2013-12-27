Template.tmpl_tdocs.helpers({
	tdocsHandle: function() {
		return tdocsHandle;
	}
});
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
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_tdocs_list.helpers({
	tdocs: function() {
		return this.fetch();
	},
	ready: function() {
		return this.ready();
	},
	allLoaded: function() {
		return ( this.fetch().length < this.loaded() );
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_tdocs_list.events({
    'click .load-more': function(e) {
        e.preventDefault();
	    this.loadNextPage();

	    Meteor.MyClientModule.scrollToBottomOfPageFast( $('div[class="post"]').last() );
    }
});
