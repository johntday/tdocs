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
	target_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(this.target_class_name).icon;
	},
	source_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(this.source_class_name).icon;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.noun_rels.events({
	'click button.btn.btn-danger.btn-sm': function(e) {
		var relationship_id = $(e.currentTarget).data('relationshipId');

		Meteor.call('deleteRelationship', relationship_id, function(error, results) {
			if(error){
				growl(error.reason);
			}else{
				growl( 'Deleted relationship', {type:'s', hideSnark:true} );
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
