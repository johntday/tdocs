NounsRelFilter = new Meteor.FilterCollections(Nouns, {
	name: 'nouns-rel-full',
	template: 'noun_rel_filter_list',
	pager: {
		options: [50],
		itemsPerPage: 50,
		currentPage: 1,
		showPages: 5
	},
	sort: {
		order: ['asc', 'desc'],
		defaults: [
			['title', 'asc']
		]
	},
	filters: {
		"area_code": {
			title: 'area_code',
			condition: '$and',
			searchable: 'optional'
		},
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
		"class_name": {
			title: 'class_name',
			condition: '$and',
			searchable: 'optional'
		}
	},
	callbacks: {
		beforeSubscribe: function (query) {
//			Session.set('loading', true);
			query.selector.type = {$nin: ['root']};
			query.selector.project_id = getProjectId();
			return query;
		}
//		,afterSubscribe: function (subscription) {
//			Session.set('loading', false);
//		}
		,beforeResults: function(query){
			query.selector.type = {$nin: ['root']};
			query.selector.project_id = getProjectId();
			return query;
		}
//		,afterResults: function(cursor){
//			var alteredResults = cursor.fetch();
//			_.each(alteredResults, function(result, idx){
//				alteredResults[idx].area = ea.getClassBelongsToArea(alteredResults[idx].class_name).area;
//			});
//			return alteredResults;
//		}
//		,templateCreated: function(template){}
//		,templateRendered: function(template){}
//		,templateDestroyed: function(template){}
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.noun_rel_filter_list.helpers({
	area: function() {
		return ea.getAreaName(this.area_code);
	},
	userId: function() {
		return Meteor.userId();
	},
	icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(this.class_name).icon;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.noun_rel_filter_list.events({
	'click button.btn.btn-info': function() {
		bootbox.dialog({
			title: "Search Help"
			,message: "<h3>Model Relationship Filtering</h3>" +
				"<ul>" +
				'<li>Click on one of the <strong>filter buttons</strong> to filter the list</li>' +
				"<li>or, type in a search string</li>" +
				'<li>to remove a filter, click on one of the <strong>active filter buttons</strong></li>' +
				'<li>All filter conditions are <strong>AND</strong>ed together</li>' +
				"</ul>" +
				"<h3>Sorting</h3>" +
				"<ul>" +
				'<li>Click on a column header to sort.  Each click will toggle between: <strong>Ascending</strong>, <strong>Desending</strong>, <strong>No-sort</strong></li>' +
				'<li><strong>bug</strong>: First column header is not shown as turned-off, when another column header is selected for sorting</li>' +
				"</ul>"
			,buttons: {
				main: {
					label: "OK",
					className: "btn-primary",
					callback: function() {
					}
				}
			}
		});
	},
	'click button.btn.btn-success': function() {
		bootbox.dialog({
			title: "Create"
			,message: "<h3>Fix Me</h3>"
			,buttons: {
				main: {
					label: "OK",
					className: "btn-primary",
					callback: function() {
					}
				}
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
