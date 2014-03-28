EA_RelationshipsFilter = new Meteor.FilterCollections(EA_Relationships, {
	name: 'ea-relationships',
	template: 'relationship_list',
	filters: {
		"source": {
			title: 'Source',
			operator: ['$regex', 'i'],
			condition: '$and',
			searchable: 'required'
		}
	},
	pager: {
		//options: [10,50],
		itemsPerPage: 25
//		currentPage: 1,
//		showPages: 5
	},
//	sort: {
//		order: ['asc', 'desc'],
//		defaults: [
//			['source', 'asc']
//		]
//	}
	callbacks: {
		beforeSubscribe: function (query) {
			query.selector.source = getSelectedTreeItem().class_name
			return query;
		},
//		,afterSubscribe: function (subscription) {
//			Session.set('loading', false);
//		}
		beforeResults: function(query){
			query.selector.source = getSelectedTreeItem().class_name
			return query;
//		},
//		afterResults: function(cursor){
//			var alteredResults = cursor.fetch();
//			_.each(alteredResults, function(result, idx){
//				alteredResults[idx].area = ea.getClassBelongsToArea(alteredResults[idx].class_name).area;
//			});
//			return alteredResults;
		}
//		,templateCreated: function(template){}
//		,templateRendered: function(template){}
//		,templateDestroyed: function(template){}
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.relationship_list.helpers({
});
/*------------------------------------------------------------------------------------------------------------------------------*/
