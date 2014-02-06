Template.tmpl_projects.helpers({
	projectsHandle: function() {
		return projectsHandle;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_projects_sort_select.helpers({
	breadcrumbs: function() {
		return [
			{title:"home", link:"/", isActive:false},
			{title:"Projects", link:"/projects", isActive:true}
		];
	},
	option_value: function() {
		return Session.get('project_sort');
	},
	options: function() {
		return getProjectSortingOptions();
	}
});
Template.tmpl_projects_sort_select.events({
	'click #project-sort': function(e) {
		e.preventDefault();
		var $selector = $('#project-sort');
		if ( Session.get('project_sort') !== $selector.val() ) {
			Session.set('project_sort', $selector.val());
			Router.go('/projects');
		}
		$selector = null;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_projects_list.helpers({
	projects: function() {
		return this.fetch();
	},
	ready: function() {
		return this.ready();
	},
	allLoaded: function() {
		return ( this.fetch().length < this.loaded() );
	}
});
Template.tmpl_projects_list.events({
    'click .load-more': function(e) {
        e.preventDefault();
	    this.loadNextPage();

	    Meteor.MyClientModule.scrollToBottomOfPageFast( $('div[class="post"]').last() );
    }
});
