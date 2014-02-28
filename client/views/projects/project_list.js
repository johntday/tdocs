Template.tmpl_projects.helpers({
	projects: function() {
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
	'click #project_sort': function(e) {
		e.preventDefault();
		var $selector = $('#project_sort');
		if ( Session.get('project_sort') !== $selector.val() ) {
			Session.set('project_sort', $selector.val());
			Router.go('/projects');
		}
		$selector = null;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
