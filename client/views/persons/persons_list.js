Template.tmpl_persons.helpers({
	personsHandle: function() {
		return personsHandle;
	},
	breadcrumbs: function() {
		Session.set('breadcrumbs', {breadcrumbs: [
			{title:"home", link:"/", isActive:false},
			{title:"People", link:"/persons", isActive:true}
		]});
		return Session.get("breadcrumbs");
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_persons_list.helpers({
	persons: function() {
		return this.fetch();
	},
	ready: function() {
		return this.ready();
	},
	allLoaded: function() {
		allPostsLoaded = this.fetch().length < this.loaded();
		Session.set('allPostsLoaded', allPostsLoaded);
		return allPostsLoaded;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_persons_sort_select.helpers({
	breadcrumbs: function() {
		return [
			{title:"home", link:"/", isActive:false},
			{title:"People", link:"/persons", isActive:true}
		];
	},
	option_value: function() {
		return Session.get('person_sort');
	},
	options: function() {
		return getPersonSortingOptions();
	}
});
Template.tmpl_persons_sort_select.events({
	'click #person_sort': function(e) {
		e.preventDefault();
		var $selector = $('#person_sort');
		if ( Session.get('person_sort') !== $selector.val() ) {
			Session.set('person_sort', $selector.val());
			Router.go('/persons');
		}
		$selector = null;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_persons_list.events({
	'click #persons.load-more': function(e) {
		e.preventDefault();
		this.loadNextPage();

		Meteor.MyClientModule.scrollToBottomOfPageFast( $('div[class="post"]').last() );
	}
});
