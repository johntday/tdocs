DiagramsFilter = new Meteor.FilterCollections(Diagrams, {
	name: 'diagrams',
	template: 'diagramFilter',
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
	filters: {
		"title": {
			title: 'title',
			operator: ['$regex', 'i'],
			condition: '$and',
			searchable: 'required'
		},
		"description": {
			title: 'description',
			operator: ['$regex', 'i'],
			condition: '$and',
			searchable: 'required'
		},
		"stars": {
			title: 'starred',
			condition: '$and',
			searchable: 'optional'
		},
		"favs": {
			title: 'favs',
			condition: '$and',
			searchable: 'optional'
		},
		"type": {
			title: 'Type',
			condition: '$and',
			searchable: 'optional'
		}
	}
//	callbacks: {
//		beforeSubscribe: function (query) {
//			query.selector.type = {$nin: ['root']};
//			query.selector.project_id = getProjectId();
//			return query;
//		},
//		beforeResults: function(query){
//			query.selector.type = {$nin: ['root']};
//			query.selector.project_id = getProjectId();
//			return query;
//		}
//	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.diagramFilter.helpers({
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
Template.diagramFilter.events({
});
/*------------------------------------------------------------------------------------------------------------------------------*/
