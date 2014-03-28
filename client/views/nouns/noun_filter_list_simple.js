NounsFilterSimple = new Meteor.FilterCollections(Nouns, {
	name: 'nouns-simple',
	template: 'noun_filter_list_simple',
	pager: {
		options: [10],
		itemsPerPage: 10
		//		currentPage: 1,
		//		showPages: 5
	},
	filters: {
		"title": {
			title: 'Title',
			operator: ['$regex', 'i'],
			condition: '$and',
			searchable: 'required'
		}
	},
//	sort: {
//		order: ['asc', 'desc'],
//		defaults: [
//			['title', 'asc']
//		]
//	},
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
Template.noun_filter_list_simple.helpers({
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
Template.noun_filter_list_simple.events({
//	'click button.btn.btn-info': function() {
//		bootbox.dialog({
//			title: "Search Help"
//			,message: "<h3>Model Item Filtering</h3>" +
//				"<ul>" +
//				'<li>Click on one of the <strong>filter buttons</strong> to filter the list</li>' +
//				"<li>or, type in a search string</li>" +
//				'<li>to remove a filter, click on one of the <strong>active filter buttons</strong></li>' +
//				'<li>All filter conditions are <strong>AND</strong>ed together</li>' +
//				"</ul>" +
//				"<h3>Sorting</h3>" +
//				"<ul>" +
//				'<li>Click on a column header to sort.  Each click will toggle between: <strong>Ascending</strong>, <strong>Desending</strong>, <strong>No-sort</strong></li>' +
//				'<li><strong>bug</strong>: First column header is not shown as turned-off, when another column header is selected for sorting</li>' +
//				"</ul>"
//			,buttons: {
//				main: {
//					label: "OK",
//					className: "btn-primary",
//					callback: function() {
//					}
//				}
//			}
//		});
//	},
//	'click button.btn.btn-success': function() {
//		bootbox.dialog({
//			title: "Create"
//			,message: "<h3>Fix Me</h3>"
//			,buttons: {
//				main: {
//					label: "OK",
//					className: "btn-primary",
//					callback: function() {
//					}
//				}
//			}
//		});
//	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
