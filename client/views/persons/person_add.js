Template.tmpl_person_add.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	canCreate: function() {
		return canCreate(Meteor.user());
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_person_add.events({
	'click #btnCreatePerson': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to create a new Person');
			$(e.target).removeClass('disabled');
			return false;
		}

		// GET INPUT
		var name= $('#name').val();
		var birth_date = formatReleaseDateForSave( $('#birth_date').val() );

		var properties = {
			name: name
			, birth_date: birth_date
		};

		// VALIDATE
		var isInputError = validatePerson(properties);
		if (isInputError) {
			$(e.target).removeClass('disabled');
			return false;
		}

		// TRANSFORM AND DEFAULTS
		transformPerson(properties);

		Meteor.call('createPerson', properties, function(error, person) {
			if(error){
				console.log(JSON.stringify(error));
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				//trackEvent("create person", {'_id': person.personId});
				Router.go('/person/'+person.personId);
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_person_add.rendered = function() {
	$("#name").focus();

	$('#div-birth_date .input-append.date').datepicker({
		autoclose: true,
		todayHighlight: true
	});

};