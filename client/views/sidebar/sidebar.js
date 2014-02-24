Template.tmplSidebar.helpers({
});

Template.tmpl_accordian_test.helpers({
	projects_cnt: function() {
		return getUserProjects().length;
	}
});

Template.tmplSidebar.events({
	'click #hide-sidebar': function(e, template) {
		e.preventDefault();

		Session.set('has_sidebar', false);
	}
});

Template.tmplSidebar.rendered = function() {
};

Template.project_dropdown.helpers({
	projectsHandle: function() {
		return projectsHandle;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.project_dropdown_list.helpers({
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
