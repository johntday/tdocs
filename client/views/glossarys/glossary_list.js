Template.tmpl_glossarys.helpers({
	glossarysHandle: function() {
		return glossarysHandle;
	}
});
Template.tmpl_glossarys_sort_select.helpers({
	breadcrumbs: function() {
		return [
			{title:"home", link:"/", isActive:false},
			{title:"Glossarys", link:"/glossarys", isActive:true}
		];
	},
	option_value: function() {
		return Session.get('glossary_sort');
	},
	options: function() {
		return getGlossarySortingOptions();
	}
});
Template.tmpl_glossarys_sort_select.events({
	'click #glossary-sort': function(e) {
		e.preventDefault();
		var $selector = $('#glossary-sort');
		if ( Session.get('glossary_sort') !== $selector.val() ) {
			Session.set('glossary_sort', $selector.val());
			Router.go('/glossarys');
		}
		$selector = null;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_glossarys_list.helpers({
	glossarys: function() {
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
Template.tmpl_glossarys_list.events({
    'click .load-more': function(e) {
        e.preventDefault();
	    this.loadNextPage();

	    Meteor.MyClientModule.scrollToBottomOfPageFast( $('div[class="post"]').last() );
    }
});
