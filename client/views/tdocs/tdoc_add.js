Template.tmpl_tdoc_add.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	canCreate: function() {
		return canCreate(Meteor.user());
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_tdoc_add.events({
	'click #btnCreateTdoc': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to create a tdoc');
			$(e.target).removeClass('disabled');
			return false;
		}

		// GET INPUT
		var title= $('#title').val();
		var description = $('#description').val();

		// CREATE OBJECT
		var properties = {
			title: title
			, description: description
		};

		// VALIDATE
		var isInputError = validateTdoc(properties);
		if (isInputError) {
			$(e.target).removeClass('disabled');
			return false;
		}

		// TRANSFORM AND DEFAULTS
		transformTdoc(properties);

		Meteor.call('createTdoc', properties, function(error, tdoc) {
			if(error){
				console.log(JSON.stringify(error));
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				Router.go('/tdocs/'+tdoc.tdocId);
			}
		});


	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_tdoc_add.rendered = function() {
	$("#title").focus();

	$('#tags').select2({
		data: [
			{id: 'gb', text: 'Great Britain'},
			{id: 'us', text: 'United States'},
			{id: 'xx', text: 'Russia'},
			{id: 'xy', text: 'asdfasdf'},
			{id: 'zz', text: 'ahraetr'},
		],
		multiple: true,
		placeholder: "add some tags",
		success: function(response, newValue) {
			var _id = this.dataset.pk;
			console.log("newValue: "+newValue);
			console.log("_id: "+_id);
		}
	})
		.on("change", function(e) {
			console.log("change");
		});

	//	$('#div-release_date .input-append.date').datepicker({
//		autoclose: true,
//		todayHighlight: true
//	});

};