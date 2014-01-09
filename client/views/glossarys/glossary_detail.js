Template.tmpl_glossary_detail.helpers({
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
		return getGlossaryStatusOptions();
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
	code: function() {
		return this.code;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_glossary_detail.events({
	'click #btnDeleteGlossary': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to delete a glossary');
			$(e.target).removeClass('disabled');
			return false;
		}

		Meteor.call('deleteGlossary', this._id, function(error) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Router.go('/glossarys');
			}
		});
	},

	'click #icon-heart': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a glossary to your favorities');
			return false;
		}

		if ( isFav(this.favs) ) {
			Glossarys.update(this._id,
				{
					$pull: { favs: user._id },
					$inc: { favs_cnt: -1 }
				}
			);
			MyLog("glossary_details.js/click #icon-heart/1", "remove from favs");
		} else {
			Glossarys.update(this._id,
				{
					$addToSet: { favs: user._id },
					$inc: { favs_cnt: 1 }
				}
			);
			MyLog("glossary_details.js/click #icon-heart/1", "add to favs");
		}
	},

	'click #icon-eye': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a glossary to your "seen it" list');
			return false;
		}

		if ( hasSeen(this.seen) ) {
			Glossarys.update(this._id, { $pull: { seen: user._id }, $inc: { seen_cnt: -1 } } );
			MyLog("glossary_details.js/click #icon-eye/2", "remove from seen");
		} else {
			Glossarys.update(this._id, { $addToSet: { seen: user._id }, $inc: { seen_cnt: 1 } } );
			MyLog("glossary_details.js/click #icon-eye/1", "remove from seen");
		}
	},

	'click #icon-star': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a glossary to your "star" list');
			return false;
		}

		if ( isStar(this.stars) ) {
			Glossarys.update(this._id, { $pull: { stars: user._id }, $inc: { stars_cnt: -1 } } );
			MyLog("glossary_details.js/click #icon-star/2", "remove from stars");
		} else {
			Glossarys.update(this._id, { $addToSet: { stars: user._id }, $inc: { stars_cnt: 1 } } );
			MyLog("glossary_details.js/click #icon-star/1", "remove from stars");
		}
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_glossary_detail.rendered = function() {
	$('.editable:not(.editable-click)').editable('destroy').editable({
		placement: 'left',
		inputclass: 'width300px',

		success: function(response, newValue) {
			// GET INPUT
			var _id = this.dataset._id;
			var field = $(this).attr('id');
			var v = (_.isString(newValue)) ? newValue.trim() : newValue;
			var fieldObj = _.object([field, 'updated'], [v, getNow()]);

			try {
				Glossarys.update(_id, {$set: fieldObj} );
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

};
