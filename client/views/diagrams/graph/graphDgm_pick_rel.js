Template.graphDgm_pick_rel.helpers({
	relationships: function() {
		input = this;
		return ea.getRelationships( input.source_class_name, input.target_class_name );
	},
	source_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(input.source_class_name).icon;
	},
	target_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(input.target_class_name).icon;
	},
	source_title: function() {
		return input.source_title;
	},
	target_title: function() {
		return input.target_title;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.graphDgm_pick_rel.events({
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.graphDgm_pick_rel.rendered = function() {
};
/*------------------------------------------------------------------------------------------------------------------------------*/
/*---------- FUNCTIONS and VARs ------------------------------------------------------------------------------------------------*/
var input;