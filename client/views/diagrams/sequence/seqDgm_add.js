Template.tmpl_diagram_add.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	canCreateDiagram: function() {
		return canCreateDiagram(Meteor.user());
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_diagram_add.events({
	'click #btnCreateDiagram': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to create a diagram');
			$(e.target).removeClass('disabled');
			return false;
		}

		// GET INPUT
		var title= $('#title').val();
		var description = $('#description').val();
		var code = $('#code').val();

		// CREATE OBJECT
		var properties = {
			title: title
			, description: description
			, code: code
		};

		// VALIDATE
		var isInputError = validateDiagram(properties);
		if (isInputError) {
			$(e.target).removeClass('disabled');
			return false;
		}

		// TRANSFORM AND DEFAULTS
		transformDiagram(properties);

		Meteor.call('createDiagram', properties, function(error, diagram) {
			if(error){
				console.log(JSON.stringify(error));
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				Router.go('/diagrams/'+diagram.diagramId);
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
Template.tmpl_diagram_add.rendered = function() {
	$('#title').focus();
};
