Template.tmpl_diagrams.helpers({
	diagramsHandle: function() {
		return diagramsHandle;
	}
});
Template.tmpl_diagrams_sort_select.helpers({
	breadcrumbs: function() {
		return [
			{title:"home", link:"/", isActive:false},
			{title:"Diagrams", link:"/diagrams", isActive:true}
		];
	},
	option_value: function() {
		return Session.get('diagram_sort');
	},
	options: function() {
		return getDiagramSortingOptions();
	}
});
Template.tmpl_diagrams_sort_select.events({
	'click #diagram-sort': function(e) {
		e.preventDefault();
		var $selector = $('#diagram-sort');
		if ( Session.get('diagram_sort') !== $selector.val() ) {
			Session.set('diagram_sort', $selector.val());
			Router.go('/diagrams');
		}
		$selector = null;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_diagrams_list.helpers({
	diagrams: function() {
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
Template.tmpl_diagrams_list.events({
    'click .load-more': function(e) {
        e.preventDefault();
	    this.loadNextPage();

	    Meteor.MyClientModule.scrollToBottomOfPageFast( $('div[class="post"]').last() );
    }
});
