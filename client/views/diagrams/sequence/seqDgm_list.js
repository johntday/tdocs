Template.tmpl_diagrams.helpers({
	diagrams: function() {
		return diagramsHandle;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
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
	},
	'click button.btn.btn-success.btn-sm': function(e) {
		e.preventDefault();
		Router.go('/diagramGraphAdd');
	},
	'click button.btn.btn-primary.btn-sm': function(e) {
		e.preventDefault();
		Router.go('/diagramAdd');
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
