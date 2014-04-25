DiagramsPicFilter = new Meteor.FilterCollections(Diagrams, {
	name: 'diagrams-pic',
	template: 'tmpl_diagrams',
	pager: {
		options: [20, 50],
		itemsPerPage: 20,
		currentPage: 1,
		showPages: 10
	},
	sort:{
		order: ['asc', 'desc'],
		defaults: [
			['title', 'asc']
		]
	},
	callbacks: {
		beforeSubscribe: function (query) {
			query.selector.project_id = getProjectId();
			return query;
		},
		beforeResults: function(query){
			query.selector.project_id = getProjectId();
			return query;
		}
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
	},
	one: function() {
		return (Location._state.path === '/diagrams') ? true : false;
	},
	two: function() {
		return (Location._state.path === '/diagrams') ? false : true;
	},
	canEdit: function() {
		return canEdit( Meteor.user() );
	}
});
Template.tmpl_diagrams_sort_select.events({
	'click #btn-diagrams-pic': function(e) {
		e.preventDefault();
		Router.go('/diagrams');
	},
	'click #btn-diagrams-tbl': function(e) {
		e.preventDefault();
		Router.go('/diagramFilter');
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
