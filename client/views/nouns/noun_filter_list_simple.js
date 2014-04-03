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
	sort: {
		defaults: [
			['title', 'asc']
		]
	},
	callbacks: {
		beforeSubscribe: function (query) {
			var class_names = ea.getPossibleClassNamesForRelationship(getSelectedTreeItem().class_name);
			query.selector.project_id = getProjectId();
			query.selector.class_name = { $in: class_names };
			query.selector.type = {$nin: ['root']};
			return query;
		}
//		,afterSubscribe: function (subscription) {
//			Session.set('loading', false);
//		}
		,beforeResults: function(query){
			var class_names = ea.getPossibleClassNamesForRelationship(getSelectedTreeItem().class_name);
			query.selector.project_id = getProjectId();
			query.selector.class_name = { $in: class_names };
			query.selector.type = {$nin: ['root']};
			return query;
		},
		afterResults: function(cursor){
			var source_class_name = getSelectedTreeItem().class_name;
			var rels = ea.getPossibleEARelsForRelationship(source_class_name);
			var alteredResults = cursor.fetch();
			_.each(alteredResults, function(item, idx){
				alteredResults[idx].semantic = rels[ source_class_name + item.class_name ].semantic;
				alteredResults[idx].rel_name = rels[ source_class_name + item.class_name ].rel_name;
			});
			return alteredResults;
		}
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
	target_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(this.class_name).icon;
	},
	source_title: function() {
		return getSelectedTreeItem().title;
	},
	source_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(getSelectedTreeItem().class_name).icon;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
//Template.noun_filter_list_simple.events({
//});
/*------------------------------------------------------------------------------------------------------------------------------*/
