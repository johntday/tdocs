Template.tmpl_userprof_detail.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	showEditButton: function() {
		return !!Meteor.user() && !Session.get('form_update')
	},
	canEditAndEditToggle: function() {
		return Meteor.user() && Session.get('form_update');
	},
	createdAgo: function() {
		return (Meteor.user().createdAt) ? moment(Meteor.user().createdAt).fromNow() : '';
	},
	statusOptions: function() {
		return getUserprofStatusOptions();
	},
	name: function() {
		return getUserDisplayName(Meteor.user());
	},
	email: function() {
		var u = Meteor.user();
		return (u && u.emails && u.emails.length>0) ? u.emails[0].address : '';
	},
	_id: function() {
		return Meteor.userId();
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_userprof_detail.events({
	'keyup #name': function(e) {
		if (e.which === 13)
			$('#btnUpdateUserprof').click();
	},
	'click #btnEditToggle': function(e) {
		e.preventDefault();
		Session.set('form_update', true);
		$("#name").focus();
	},
	'click #btnCancelUserprof': function(e) {
		e.preventDefault();
		Session.set('form_update', false);
	},
	'click #btnUpdateUserprof': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to update your profile');
			$(e.target).removeClass('disabled');
			return false;
		}

		// GET INPUT
		var properties = {
			//email: $('#email').val()
			name: $('#name').val()
		};

		// VALIDATE and TRANSFORM
		var isInputError = validateUserprof(properties);
		if (isInputError) {
			$(e.target).removeClass('disabled');
			return false;
		}
		transformUserprof(properties);

		Meteor.call('updateUserprof', properties, function(error, userprof) {
			if(error){
				growl(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				growl( "Profile updated", {type:'s', hideSnark:true} );
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
//Template.tmpl_userprof_detail.rendered = function() {
//};