NounsFilter = new Meteor.FilterCollections(Nouns, {
	name: 'possible-rels-for-noun',
	template: 'possible_rels_for_noun',
	pager: {
		options: [50],
		itemsPerPage: 50,
		currentPage: 1,
		showPages: 10
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
			var class_names = ea.getPossibleClassNamesForRelationship(getSelectedTreeItem().class_name);
			query.selector.project_id = getProjectId();
			query.selector.class_name = { $in: class_names };
			query.selector.type = {$nin: ['root']};
			return query;
		},
		beforeResults: function(query){
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
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.possible_rels_for_noun.helpers({
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
Template.possible_rels_for_noun.events({
});
/*------------------------------------------------------------------------------------------------------------------------------*/
