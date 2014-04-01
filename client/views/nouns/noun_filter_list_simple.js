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
			query.selector.project_id = getProjectId();
			query.selector.class_name = {$in: ea.getPossibleClassNamesForRelationship(getSelectedTreeItem().class_name)};
			query.selector.type = {$nin: ['root']};
			return query;
		}
//		,afterSubscribe: function (subscription) {
//			Session.set('loading', false);
//		}
		,beforeResults: function(query){
			query.selector.project_id = getProjectId();
			query.selector.class_name = {$in: ea.getPossibleClassNamesForRelationship(getSelectedTreeItem().class_name)};
			query.selector.type = {$nin: ['root']};
			return query;
		},
		afterResults: function(cursor){
			var alteredResults = cursor.fetch();
			_.each(alteredResults, function(result, idx){
				var selectedNoun = getSelectedTreeItem(true);
				var semantic = ea.getRelationshipSemantic( selectedNoun.original.class_name, result.class_name, '' );//TODO
				alteredResults[idx].semantic = semantic;
				//alteredResults[idx].rel_name = rel.rel_name;
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
	icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(this.class_name).icon;
	},
	source_title: function() {
		return getSelectedTreeItem().title;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
//Template.noun_filter_list_simple.events({
//});
/*------------------------------------------------------------------------------------------------------------------------------*/
