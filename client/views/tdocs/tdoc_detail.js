Template.tmpl_tdoc_detail.helpers({
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
	createdAgo: function() {
		return (this.created) ? moment(this.created).fromNow() : 'never';
	},
	updatedAgo: function() {
		return (this.updated) ? moment(this.updated).fromNow() : 'never';
	},
	statusOptions: function() {
		return getTdocStatusOptions();
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
Template.tmpl_tdoc_detail.events({
	'click #btnDeleteTdoc': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to delete a tdoc');
			$(e.target).removeClass('disabled');
			return false;
		}

		Meteor.call('deleteTdoc', this._id, function(error) {
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
			throwError('You must login to add a tdoc to your favorities');
			return false;
		}

		if ( isFav(this.favs) ) {
			Tdocs.update(this._id,
				{
					$pull: { favs: user._id },
					$inc: { favs_cnt: -1 }
				}
			);
			MyLog("tdoc_details.js/click #icon-heart/1", "remove from favs");
		} else {
			Tdocs.update(this._id,
				{
					$addToSet: { favs: user._id },
					$inc: { favs_cnt: 1 }
				}
			);
			MyLog("tdoc_details.js/click #icon-heart/1", "add to favs");
		}
	},

	'click #icon-eye': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a tdoc to your "seen it" list');
			return false;
		}

		if ( hasSeen(this.seen) ) {
			Tdocs.update(this._id, { $pull: { seen: user._id }, $inc: { seen_cnt: -1 } } );
			MyLog("tdoc_details.js/click #icon-eye/2", "remove from seen");
		} else {
			Tdocs.update(this._id, { $addToSet: { seen: user._id }, $inc: { seen_cnt: 1 } } );
			MyLog("tdoc_details.js/click #icon-eye/1", "remove from seen");
		}
	},

	'click #icon-star': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a tdoc to your "star" list');
			return false;
		}

		if ( isStar(this.stars) ) {
			Tdocs.update(this._id, { $pull: { stars: user._id }, $inc: { stars_cnt: -1 } } );
			MyLog("tdoc_details.js/click #icon-star/2", "remove from stars");
		} else {
			Tdocs.update(this._id, { $addToSet: { stars: user._id }, $inc: { stars_cnt: 1 } } );
			MyLog("tdoc_details.js/click #icon-star/1", "remove from stars");
		}
	}

//	'click #btnUpdateTdoc': function(e) {
//		e.preventDefault();
//		$(e.target).addClass('disabled');
//
//		if(!Meteor.user()){
//			throwError('You must login to update a tdoc');
//			$(e.target).removeClass('disabled');
//			return false;
//		}
//
//		// GET INPUT
//		var _id = this._id;
//		var title= $('#title').val();
//		var description = $('#description').val();
//		var status = $('#status').val();
//
//		var properties = {
//			title: title
//			, description: description
//		};
//
//		if ( isAdmin(Meteor.user()) ) {
//			_.extend(properties, {
//				status: status
//			});
//		}
//
//		// VALIDATE
//		var isInputError = validateTdoc(properties);
//		if (isInputError) {
//			$(e.target).removeClass('disabled');
//			return false;
//		}
//
//		// TRANSFORM AND DEFAULTS
//		transformTdoc(properties);
//
//		Meteor.call('updateTdoc', _id, properties, function(error, tdoc) {
//			if(error){
//				console.log(JSON.stringify(error));
//				throwError(error.reason);
//				$(e.target).removeClass('disabled');
//			}else{
//				Session.set('form_update', false);
//				MyLog("tdoc_details.js/1", "updated tdoc", {'_id': _id, 'title': tdoc.title});
//				Router.go('/tdocs/'+_id);
//			}
//		});
//	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_tdoc_detail.rendered = function() {
	$("#title").focus();

	$('.editable:not(.editable-click)').editable('destroy').editable({
		success: function(response, newValue) {
			// GET INPUT
			var _id = this.dataset._id;
			var field = $(this).attr('id');
			var description = (_.isString(newValue)) ? newValue.trim() : newValue;
			var fieldObj = _.object([field, 'updated'], [description, getNow()]);

			try {
				Tdocs.update(_id, {$set: fieldObj} );
			} catch (err) {
				throwError(JSON.stringify(err));
			}
		},
		validate: function(value) {
			var field = $(this).attr('id');
			if ( field==='title' )
				return checkTitle(value);
			if ( field==='description' )
				return checkDescription(value);
		}
	});
//	$('#title.editable:not(.editable-click)').editable('destroy').editable({
//		success: function(response, newValue) {
//			//$('#btnUpdateTdoc').addClass('disabled');
//
//			// GET INPUT
//			var _id = this.dataset._id;
//			var title= $('#title').val();
//			var title = newValue;
//			var status = $('#status').val();
//			console.log('this._id='+_id);
//
//			console.log('title='+title);
//
//
//			var properties = {
//				title: title
//				, title: title
//			};
//
//			if ( isAdmin(Meteor.user()) ) {
//				_.extend(properties, {
//					status: status
//				});
//			}
//
//			// VALIDATE
//			var isInputError = validateTdoc(properties);
//			if (isInputError) {
//				return false;
//			}
//
//			// TRANSFORM AND DEFAULTS
//			transformTdoc(properties);
//
//			Meteor.call('updateTdoc', _id, properties, function(error, tdoc) {
//				if(error){
//					throwError(error.reason);
//				}else{
//					MyLog("tdoc_details.js/1", "updated tdoc", {'_id': _id, 'title': tdoc.title});
//				}
//			});
//		},
//		error: function(response, newValue) {
//			if(response.status === 500) {
//				return 'Service unavailable. Please try later.';
//			} else {
//				return response.responseText;
//			}
//		},
//		validate: function(value) {
//			return checkFieldLength(value, 10, 128);
//		}
//	});
//
};