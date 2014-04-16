Template.tmpl_graphDgm_add.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	canCreate: function() {
		return canCreate(Meteor.user());
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_add.events({
	'click #btnCreateGraph': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to create a Graph Diagram');
			$(e.target).removeClass('disabled');
			return false;
		}

		// CREATE OBJECT
		var properties = {
			type: TYPES.graphDiagram
			, title: $('#title').val()
			, description: $('#description').val()
			, project_id: getProjectId()
		};

		// VALIDATE AND TRANSFORM
		var isInputError = validateGraph(properties);
		if (isInputError) {
			$(e.target).removeClass('disabled');
			return false;
		}
		transformGraph(properties);

		Meteor.call('createDiagram', properties, function(error, diagram) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				Router.go('/graph/'+diagram.diagramId);
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_add.rendered = function() {
	$("#title").focus();

	//	$('#div-release_date .input-append.date').datepicker({
//		autoclose: true,
//		todayHighlight: true
//	});

};