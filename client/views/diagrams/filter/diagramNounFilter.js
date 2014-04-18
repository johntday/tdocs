DiagramsFilter = new Meteor.FilterCollections(Diagrams, {
	name: 'diagrams-nouns',
	template: 'diagramNounFilter',
	pager: {
		itemsPerPage: 5,
		currentPage: 1,
		showPages: 5
	},
	sort:{
		order: ['asc', 'desc'],
		defaults: [
			['title', 'asc']
		]
	},
	filters: {
		"nouns": {
			title: 'nouns',
			condition: '$and',
			searchable: 'optional'
		}
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.diagramNounFilter.helpers({
	userId: function() {
		return Meteor.userId();
	},
	createdAgo: function() {
		return (this.created) ? moment(this.created).fromNow() : "Never Created";
	},
	created: function() {
		return (this.created) ? moment(this.created) : "";
	},
	updatedAgo: function() {
		return (this.updated) ? moment(this.updated).fromNow() : "Never Updated";
	},
	updated: function() {
		return (this.updated) ? moment(this.updated) : "";
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.diagramNounFilter.events({
	'click button.btn.btn-primary.btn-sm': function(e) {
		var diagram_id = $(e.currentTarget).data('diagramId');
		console.log(diagram_id);
		if (diagram_id)
			Router.go('/graph/'+diagram_id);
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
