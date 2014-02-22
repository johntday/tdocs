Template.tmpl_glossary_add.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	canCreate: function() {
		return canCreate(Meteor.user());
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_glossary_add.events({
	'click #btnCreateGlossary': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to create a glossary');
			$(e.target).removeClass('disabled');
			return false;
		}

		// GET INPUT
		var title= $('#title').val();
		var description = $('#description').val();

		// CREATE OBJECT
		var properties = {
			type: TYPES.glossary
			, title: title
			, description: description
			, project_id: getProjectId()
		};

		// VALIDATE
		var isInputError = validateGlossary( properties );
		if (isInputError) {
			$(e.target).removeClass('disabled');
			$('#title').focus();
			return false;
		}

		// TRANSFORM AND DEFAULTS
		transformGlossary(properties);

		Meteor.call('createGlossary', properties, function(error, glossary) {
			if(error){
				console.log(JSON.stringify(error));
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				Router.go('/glossarys/'+glossary.glossaryId);
			}
		});

	},

	'keyup #code, focus #code, keyup #description, focus #description': function(e) {
		e.preventDefault();
		var $element = $(e.target).get(0);
		$element.style.overflow = 'hidden';
		$element.style.height = 0;
		$element.style.height = $element.scrollHeight + 'px';
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_glossary_add.rendered = function() {
	$('#title').focus();
};
