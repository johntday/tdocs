Template.tmpl_noun_add.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	canCreate: function() {
		return canCreate(Meteor.user());
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_noun_add.events({
	'click #btnCreateNoun': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to create a noun');
			$(e.target).removeClass('disabled');
			return false;
		}
		if(!getProjectId()){
			throwError('You must select a project first');
			$(e.target).removeClass('disabled');
			return false;
		}

		// CREATE OBJECT
		var properties = {
			type: 'Business_Capability'
			, title: $('#title').val()
			, description: $('#description').val()
			, project_id: getProjectId()
			, parent_id: ''
		};

		// VALIDATE and TRANSFORM
//		var isInputError = validateNoun(properties);
//		if (isInputError) {
//			$(e.target).removeClass('disabled');
//			return false;
//		}
//		transformNoun(properties);

		Meteor.call('createNoun', properties, function(error, noun) {
			if(error){
				console.log(JSON.stringify(error));
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				Router.go('/nouns/'+noun.nounId);
			}
		});
	},

	'keyup #description, focus #description': function(e) {
		e.preventDefault();
		var $element = $(e.target).get(0);
		$element.style.overflow = 'hidden';
		$element.style.height = 0;
		$element.style.height = $element.scrollHeight + 'px';
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_noun_add.rendered = function() {
	$("#title").focus();
};