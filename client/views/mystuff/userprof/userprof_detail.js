Template.tmpl_userprof_detail.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	breadcrumbs: function() {
		Meteor.MyClientModule.scrollToTopOfPageFast();
		return Session.get("breadcrumbs");
	},
	canEdit: function() {
		return canEdit(Meteor.user(), this);
	},
	canEditAndEditToggle: function() {
		return canEdit(Meteor.user(), this) && Session.get('form_update');
	},
	canEditAndEditToggleAdmin: function() {
		return isAdmin() && Session.get('form_update');
	},
	createdAgo: function() {
		return (this.created) ? moment(this.created).fromNow() : this.created;
	},
	updatedAgo: function() {
		return (this.updated) ? moment(this.updated).fromNow() : this.updated;
	},
	statusOptions: function() {
		return getUserprofStatusOptions();
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
	},
	name: function() {
		return (this.profile && this.profile.name) ? this.profile.name : '';
	},
	title: function() {
		return getUserDisplayName(this);
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_userprof_detail.events({
	'click #btnDeleteUserprof': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to delete a userprof');
			$(e.target).removeClass('disabled');
			return false;
		}

		Meteor.call('deleteUserprof', this._id, function(error) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Router.go('/tdocs');
			}
		});
	},

	'click #icon-heart': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a userprof to your favorities');
			return false;
		}

		if ( isFav(this.favs) ) {
			Userprofs.update(this._id,
				{
					$pull: { favs: user._id },
					$inc: { favs_cnt: -1 }
				}
			);
			MyLog("userprof_details.js/click #icon-heart/1", "remove from favs");
		} else {
			Userprofs.update(this._id,
				{
					$addToSet: { favs: user._id },
					$inc: { favs_cnt: 1 }
				}
			);
			MyLog("userprof_details.js/click #icon-heart/1", "add to favs");
		}
	},

	'click #icon-eye': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a userprof to your "seen it" list');
			return false;
		}

		if ( hasSeen(this.seen) ) {
			Userprofs.update(this._id, { $pull: { seen: user._id }, $inc: { seen_cnt: -1 } } );
			MyLog("userprof_details.js/click #icon-eye/2", "remove from seen");
		} else {
			Userprofs.update(this._id, { $addToSet: { seen: user._id }, $inc: { seen_cnt: 1 } } );
			MyLog("userprof_details.js/click #icon-eye/1", "remove from seen");
		}
	},

	'click #icon-star': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a userprof to your "star" list');
			return false;
		}

		if ( isStar(this.stars) ) {
			Userprofs.update(this._id, { $pull: { stars: user._id }, $inc: { stars_cnt: -1 } } );
			MyLog("userprof_details.js/click #icon-star/2", "remove from stars");
		} else {
			Userprofs.update(this._id, { $addToSet: { stars: user._id }, $inc: { stars_cnt: 1 } } );
			MyLog("userprof_details.js/click #icon-star/1", "remove from stars");
		}
	},

	'click #btnEditToggle': function(e) {
		e.preventDefault();
		Session.set('form_update', true);
	},

	'click #btnUpdateUserprof': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to update a userprof');
			$(e.target).removeClass('disabled');
			return false;
		}

		// GET INPUT
		var _id = this._id;
		var title= $('#title').val();
		var year = $('#year').val();
		var release_date = formatReleaseDateForSave( $('#release_date').val() );
		var original_title= $('#original_title').val();
		var mpaa_rating= $('#mpaa_rating').val();
		var runtime= $('#runtime').val();
		var tagline= $('#tagline').val();
		var overview= $('#overview').val();
		var critics_consensus= $('#critics_consensus').val();
		var adult = $('#adult').prop('checked');
		var status = $('#status').val();

		var properties = {
			title: title
			, year: year
			, release_date: release_date
			, original_title: original_title
			, mpaa_rating: mpaa_rating
			, runtime: runtime
			, tagline: tagline
			, overview: overview
			, critics_consensus: critics_consensus
			, adult: adult
		};

		if ( isAdmin(Meteor.user()) ) {
			_.extend(properties, {
				status: status
			});
		}

		// VALIDATE
		var isInputError = validateUserprof(properties);
		if (isInputError) {
			$(e.target).removeClass('disabled');
			return false;
		}

		// TRANSFORM AND DEFAULTS
		transformUserprof(properties);

		Meteor.call('updateUserprof', _id, properties, function(error, userprof) {
			if(error){
				console.log(JSON.stringify(error));
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				MyLog("userprof_details.js/1", "updated userprof", {'_id': _id, 'title': userprof.title});
				Router.go('/tdocs/'+_id);
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_userprof_detail.rendered = function() {
	$("#name").focus();

//	$('#div-release_date .input-append.date').datepicker({
//		autoclose: true,
//		todayHighlight: true
//	});

	if ( Session.get('form_update') ) {
		$("#btnEditToggle").addClass("active");
	} else {
		$("#btnEditToggle").removeClass("active");
	}
};