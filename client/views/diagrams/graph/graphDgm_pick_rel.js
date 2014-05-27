var d;

Template.graphDgm_pick_rel.helpers({
	relationships: function() {
		d = this;
		var rels = ea.getRelationships( this.source_class_name, this.target_class_name );
		return rels;
	},
	source_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(d.source_class_name).icon;
	},
	target_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(d.target_class_name).icon;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
/*---------- FUNCTIONS and VARs ------------------------------------------------------------------------------------------------*/
