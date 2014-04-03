Template.tmpl_project_add.helpers({
	canCreate: function() {
		return (!!Meteor.user());
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_project_add.events({
	'keyup #title, keyup #description': function(e) {
		if (e.which === 13)
			$('#btnCreateProject').click();
	},
	'click #btnCreateProject': function(e) {
	e.preventDefault();
	$(e.target).addClass('disabled');

	if(!Meteor.user()){
		throwError('You must login to create a project');
		$(e.target).removeClass('disabled');
		return false;
	}

	// GET INPUT
	var title= $('#title').val();
	var description = $('#description').val();

	// CREATE OBJECT
	var properties = {
		type: TYPES.project
		, title: title
		, description: description
	};

	// VALIDATE
	var isInputError = validateProject(properties);
	if (isInputError) {
		$(e.target).removeClass('disabled');
		return false;
	}

	// TRANSFORM AND DEFAULTS
	transformProject(properties);

	Meteor.call('createProject', properties, function(error, project) {
		if(error){
			console.log(JSON.stringify(error));
			throwError(error.reason);
			$(e.target).removeClass('disabled');
		}else{
			Session.set('form_update', false);
			Router.go('/projects/'+project.projectId);
		}
	});

	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_project_add.rendered = function() {
	$('#title').focus();
};
