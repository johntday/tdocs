Template.tmpl_table_add.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	canCreate: function() {
		return canCreate(Meteor.user());
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_table_add.events({
	'click #btnCreateTable': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to create a table');
			$(e.target).removeClass('disabled');
			return false;
		}

		// CREATE OBJECT
		var properties = {
			type: TYPES.table
			, title: $('#title').val()
			, description: $('#description').val()
			, project_id: getProjectId()
		};

		// VALIDATE
		var isInputError = validateTable(properties);
		if (isInputError) {
			$(e.target).removeClass('disabled');
			return false;
		}

		// TRANSFORM AND DEFAULTS
		transformTable(properties);

		Meteor.call('createTable', properties, function(error, table) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				Router.go('/tables/'+table.tableId);
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
Template.tmpl_table_add.rendered = function() {
	$('#title').focus();
};
