Template.tmpl_glossary_detail.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	breadcrumbs: function() {
		Meteor.MyClientModule.scrollToTopOfPageFast();
		return Session.get("breadcrumbs");
	},
	showEditButton: function() {
		return showEditButton();
	},
	canEditAndEditToggle: function() {
		return canEditAndEditToggle();
	},
	createdAgo: function() {
		return dateAgo(this.created);
	},
	updatedAgo: function() {
		return dateAgo(this.updated);
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
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_glossary_detail.events({
	'click #btnEditToggle, click #btnCancelGlossary': function(e) {
		e.preventDefault();
		Session.set('form_update', !Session.get('form_update'));
	},

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
	},

	'click #btnUpdateGlossary': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to update a glossary');
			$(e.target).removeClass('disabled');
			return false;
		}

		// GET INPUT
		var _id = this._id;

		// CREATE OBJECT
		var properties = {
			title: $('#title').val()
			, description: $('#description').val()
		};

		if ( isAdmin(Meteor.user()) ) {
			_.extend(properties, {
				status: status
			});
		}

		// VALIDATE
		var isInputError = validateGlossary(properties);
		if (isInputError) {
			$(e.target).removeClass('disabled');
			return false;
		}

		// TRANSFORM AND DEFAULTS
		transformGlossary(properties);

		Meteor.call('updateGlossary', _id, properties, function(error, glossary) {
			if(error){
				MyLog("glossary_details.js/1", "updated glossary", {'error': error, 'title': glossary.title});
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				MyLog("glossary_details.js/1", "updated glossary", {'_id': _id, 'title': glossary.title});
				//Router.go('/glossarys/'+_id);
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_glossary_detail.rendered = function() {
	$('#title').focus();
	$('#description').focus();
};
