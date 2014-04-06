Template.tmpl_project_user_add.helpers({
	admins: function() {
		var query = findUsersByRoles(this._id, true, 'admin');
		return Meteor.users.find(query, {sort: {"profile.name": 1}});
	},
	editors: function() {
		var query = findUsersByRoles(this._id, true, 'edit');
		return Meteor.users.find(query, {sort: {"profile.name": 1}});
	},
	readers: function() {
		var query = findUsersByRoles(this._id, true, 'read');
		return Meteor.users.find(query, {sort: {"profile.name": 1}});
	},
	isProjectAdmin: function() {
		return isProjectAdmin( Meteor.user() );
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_project_user_add.events({
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_project_user_add.rendered = function() {
	var _id = this.data._id;
	Meteor.typeahead(
		$("#admins"),
		persons,
		/*onSelection*/function() {
			Meteor.call('updateRoles', this._id, ['admin'], getProjectId(), function(error) {
				if(error){
					throwError(error.reason);
				} else {
					growl( "User added to ADMIN group", {type:'s', hideSnark:true} );
				}
			});
		}
	);
	Meteor.typeahead(
		$("#editors"),
		persons,
		/*onSelection*/function() {
			Meteor.call('updateRoles', this._id, ['edit'], getProjectId(), function(error) {
				if(error){
					throwError(error.reason);
				} else {
					growl( "User added to EDIT group", {type:'s', hideSnark:true} );
				}
			});
		}
	);
	Meteor.typeahead(
		$("#readers"),
		persons,
		/*onSelection*/function() {
			Meteor.call('updateRoles', this._id, ['read'], getProjectId(), function(error) {
				if(error){
					throwError(error.reason);
				} else {
					growl( "User added to READ group", {type:'s', hideSnark:true} );
				}
			});
		}
	);
};
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_project_user_add.destroyed = function() {
};
/*------------------------------------------------------------------------------------------------------------------------------*/
var persons = function(text, callback){
	Meteor.call('findPersons', text, function(err, result){
		callback(
			result.map(function(v){
				return { _id: v._id, value: v.profile.name };
			})
		);
	});
};
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_project_user_add_item.helpers({
	showRemove: function() {
		var loggedInUserId = Meteor.userId();
		return (
			loggedInUserId !== this._id
			&& this._id !== getProjectOwnerId()
			&& Roles.userIsInRole(loggedInUserId, ['admin'], getProjectId())
			);
	},
	project_id: function() {
		return getProjectId();
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_project_user_add_item.events({
	'click a.glyphicon-remove': function(e) {
		var loggedInUser = Meteor.user();
		var targetUserId = $(e.currentTarget).data('userId');

		if ( !loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'], getProjectId())) {
			throwError( "You must be in Administrator to perform this function" );
			e.preventDefault();
			return;
		}
		if ( loggedInUser._id === targetUserId ) {
			throwError("You cannot remove you own role");
			e.preventDefault();
			return;
		}


		Meteor.call('removeRoles', targetUserId, getProjectId(), function(error) {
			if(error){
				throwError(error.reason);
			}else{
				growl( "User removed from group", {type:'s', hideSnark:true} );
			}
		});

	}
});
