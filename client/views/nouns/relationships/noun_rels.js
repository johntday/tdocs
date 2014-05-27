// UI:Relationships
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.noun_rels.helpers({
	target_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(this.target_class_name).icon;
	},
	source_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(this.source_class_name).icon;
	},
	canEdit: function() {
		return canEdit( Meteor.user() );
	},
	tables: function () {
		var selected_id = getSelectedTreeItem()._id;
		var query = {project_id: getProjectId(), $or: [{source_id:selected_id}, {target_id:selected_id}]};

		return Relationships.find(query);
	},
	tableSettings: function () {
		return {
			rowsPerPage: 15,
			showNavigation: 'auto',
			showFilter: false,
			fields: [
				{ key: 'source_class_name', label: ' ', fn: function(value){
					return getIcon(value);
				} },
				{ key: 'source_title', label: 'Source' },
				{ key: 'semantic', label: 'Relationship' },
				{ key: 'target_class_name', label: ' ', fn: function(value){
					return getIcon(value);
				} },
				{ key: 'target_title', label: 'Target' }
			]
		};
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
/*--------- FUNCTIONS ----------------------------------------------------------------------------------------------------------*/
var getIcon = function(class_name){
	var clazz = 'glyphicon glyphicon-' + ea.getClassBelongsToArea(class_name).icon;
	return new Spacebars.SafeString('<span class="' + clazz + '"></span>');
};