Template.tmpl_project_user_add.helpers({
	admins: function() {
		var query = findUsersByRoles(this._id, true, 'admin');
		return Meteor.users.find(query, {sort: {"profile.name": 1}});
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
					growl( "User added to group", {type:'s', hideSnark:true} );
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
	notme: function() {
		return (Meteor.userId() !== this._id);
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
		console.log( loggedInUser._id, targetUserId, this._id );
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
