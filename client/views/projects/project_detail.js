Template.tmpl_project_detail.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	breadcrumbs: function() {
		Meteor.MyClientModule.scrollToTopOfPageFast();
		return Session.get("breadcrumbs");
	},
	showEditButton: function() {
		return showEditButton(this);
	},
	canEditAndEditToggle: function() {
		return canEditAndEditToggle(this);
	},
	isAdminAndEditToggle: function() {
		return isAdminAndEditToggle();
	},
	createdAgo: function() {
		return dateAgo(this.created);
	},
	updatedAgo: function() {
		return dateAgo(this.updated);
	},
	statusOptions: function() {
		return getProjectStatusOptions();
	},
	isFav: function() {
		return isFav(this.favs);
	},
	hasSeen: function() {
		return hasSeen(this.seen);
	},
	isStar: function() {
		return isStar(this.stars);
	},
	click_cnt: function() {
		return (this.click_cnt) ? this.click_cnt : 0;
	},
	favs_cnt: function() {
		return (this.favs_cnt && this.favs_cnt > -1) ? this.favs_cnt : 0;
	},
	seen_cnt: function() {
		return (this.seen_cnt && this.seen_cnt > -1) ? this.seen_cnt : 0;
	},
	stars_cnt: function() {
		return (this.stars_cnt && this.stars_cnt > -1) ? this.stars_cnt : 0;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_project_detail.events({
	'click #btnEditToggle': function(e) {
		e.preventDefault();
		Session.set('form_update', true);
	},

	'click #btnCancelProject': function(e) {
		e.preventDefault();
		Session.set('form_update', false);
	},

	'click #btnDeleteProject': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to delete a project');
			$(e.target).removeClass('disabled');
			return false;
		}

		Meteor.call('deleteProject', this._id, function(error) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				growl( "Project item deleted", {type:'s', hideSnark:true} );
				Router.go('/projects');
			}
		});
	},

	'click #icon-heart': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a project to your favorities');
			return false;
		}

		if ( isFav(this.favs) ) {
			Projects.update(this._id,
				{
					$pull: { favs: user._id },
					$inc: { favs_cnt: -1 }
				}
			);
			MyLog("project_details.js/click #icon-heart/1", "remove from favs");
		} else {
			Projects.update(this._id,
				{
					$addToSet: { favs: user._id },
					$inc: { favs_cnt: 1 }
				}
			);
			MyLog("project_details.js/click #icon-heart/1", "add to favs");
		}
	},

	'click #icon-eye': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a project to your "seen it" list');
			return false;
		}

		if ( hasSeen(this.seen) ) {
			Projects.update(this._id, { $pull: { seen: user._id }, $inc: { seen_cnt: -1 } } );
			MyLog("project_details.js/click #icon-eye/2", "remove from seen");
		} else {
			Projects.update(this._id, { $addToSet: { seen: user._id }, $inc: { seen_cnt: 1 } } );
			MyLog("project_details.js/click #icon-eye/1", "remove from seen");
		}
	},

	'keyup #description, focus #description': function(e) {
		e.preventDefault();
		var $element = $(e.target).get(0);
		$element.style.overflow = 'hidden';
		$element.style.height = 0;
		$element.style.height = $element.scrollHeight + 'px';
	},

	'click #icon-star': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a project to your "star" list');
			return false;
		}

		if ( isStar(this.stars) ) {
			Projects.update(this._id, { $pull: { stars: user._id }, $inc: { stars_cnt: -1 } } );
			MyLog("project_details.js/click #icon-star/2", "remove from stars");
		} else {
			Projects.update(this._id, { $addToSet: { stars: user._id }, $inc: { stars_cnt: 1 } } );
			MyLog("project_details.js/click #icon-star/1", "remove from stars");
		}
	},

	'click #btnUpdateProject': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to update a project');
			$(e.target).removeClass('disabled');
			return false;
		}

		// GET INPUT
		var _id = this._id;

		// CREATE OBJECT
		var properties = {
			type: TYPES.project
			, title: $('#title').val()
			, description: $('#description').val()
		};

		if ( isAdmin(Meteor.user()) ) {
			_.extend(properties, {
				status: $('#status').val()
			});
		}

		// VALIDATE
		var isInputError = validateProject(properties);
		if (isInputError) {
			$(e.target).removeClass('disabled');
			return false;
		}

		// TRANSFORM AND DEFAULTS
		transformProject(properties);

		Meteor.call('updateProject', _id, properties, function(error, project) {
			if(error){
				MyLog("project_details.js/1", "updated project", {'error': error, 'project': project});
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				growl( "Project item updated", {type:'s', hideSnark:true} );
				MyLog("project_details.js/1", "updated project", {'_id': _id, 'project': project});
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_project_detail.rendered = function() {
	var _id = this.data._id;
	Meteor.typeahead(
		$("#admins"),
		persons,
		/*onSelection*/function() {
			Meteor.call('updateRoles', this._id, ['admin'], getProjectId(), function(error) {
				if(error){
					throwError(error.reason);
				}
			});
		}
	);

	$('#title').focus();
	$('#description').focus();
	if ( !Session.get('form_update') )
		$("#description").blur();
};
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_project_detail.destroyed = function() {
	incClickCnt(Projects, this.data._id);
};

var persons = function(query, callback){
	Meteor.call('findPersons', query, function(err, result){
		callback(
			result.map(function(v){
				return { _id: v._id, value: v.profile.name };
			})
		);
	});
};
