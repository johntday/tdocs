
Template.graphDgm_pick_rel.helpers({
	relationships: function() {
		return ea.getRelationships( this.source_class_name, this.target_class_name );
	},
	source_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(this.source_class_name).icon;
	},
	target_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(this.target_class_name).icon;
	},
	source_title: function() {
		return this.source_title;
	},
	target_title: function() {
		return this.target_title;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
/*---------- FUNCTIONS and VARs ------------------------------------------------------------------------------------------------*/
