Template.graphDgm_pick_rel.helpers({
	relationships: function() {
		input = this;
//		return EA_Relationships.find( {'$or':[{source:this.target_class_name, target:this.source_class_name},
//			{source:this.source_class_name, target:this.target_class_name}]} );
		return EA_Relationships.find( {source:this.target_class_name, target:this.source_class_name} );
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