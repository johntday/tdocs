/**
 * properties = {
	 *   project_id: 'xxx'
	 *   ,rel_name: 'composition'
	 *   ,source_id: 'xxx'
	 *   ,target_id: 'xxx'
	 *   ,source_title: 'xxx'
	 *   ,target_title: 'xxx'
	 *   ,source_area_code: 'b'
	 *   ,target_area_code: 'b'
	 *   ,source_class_name: 'Business_Object'
	 *   ,target_class_name: 'Business_Object'
	 *   ,attrs: [ ['name1','value1'], ['name2','value2'] ]
	 * }
 */
NounsRelsFilter = new Meteor.FilterCollections(Relationships, {
	name: 'nouns-rels',
	template: 'noun_rels',
	pager: {
		options: [10,50],
		itemsPerPage: 10,
		currentPage: 1,
		showPages: 5
	},
	filters: {
		"target_title": {
			title: 'Title',
			operator: ['$regex', 'i'],
			condition: '$and',
			searchable: 'required'
		}
	},
	sort: {
		defaults: [
			['target_title', 'asc']
		]
	},
	callbacks: {
		beforeSubscribe: function (query) {
			var selected_id = getSelectedTreeItem()._id;
			query.selector = {project_id: getProjectId(), $or: [{source_id:selected_id}, {target_id:selected_id}]}
			return query;
		}
		,beforeResults: function(query){
			var selected_id = getSelectedTreeItem()._id;
			query.selector = {project_id: getProjectId(), $or: [{source_id:selected_id}, {target_id:selected_id}]}
			return query;
//		},
//		afterResults: function(cursor){
//			var alteredResults = cursor.fetch();
//			_.each(alteredResults, function(result, idx){
//				var selectedNoun = getSelectedTreeItem(true);
//				var rel = ea.getRelationshipSemantic( selectedNoun.original.class_name, result.class_name );
//				alteredResults[idx].semantic = rel.semantic;
//				alteredResults[idx].rel_name = rel.rel_name;
//			});
//			return alteredResults;
		}
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.noun_rels.helpers({
});
/*------------------------------------------------------------------------------------------------------------------------------*/
//Template.noun_rels.events({
//});
/*------------------------------------------------------------------------------------------------------------------------------*/
