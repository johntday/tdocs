Template.graphDgm_pick_rel.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	forward: function() {
		console.log( this );
		var relationships = ea.getRelationships(this.source_class_name, this.target_class_name, true);
		console.log( relationships );
		return (relationships) ? relationships.forward : [];
	},
	reverse: function() {
		console.log( this );
		var relationships = ea.getRelationships(this.source_class_name, this.target_class_name, true);
		return (relationships) ? relationships.reverse : [];
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
