Template.tmpl_project_add.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	canCreate: function() {
		return canCreate(Meteor.user());
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_project_add.events({
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

	},

	'keyup #code, focus #code, keyup #description, focus #description': function(e) {
		//e.preventDefault();
		var $element = $(e.target).get(0);
		$element.style.overflow = 'hidden';
		$element.style.height = 0;
		$element.style.height = $element.scrollHeight + 'px';
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_project_add.rendered = function() {
	$('#title').focus();
};
