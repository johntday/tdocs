Template.tmpl_person_detail.helpers({
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
	formattedBirthDate: function() {
		return formatReleaseDateForDisplay(this.birth_date);
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
	statusOptions: function() {
		return getTdocStatusOptions();
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_person_detail.events({
	'click #btnDeletePerson': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to delete a Person');
			$(e.target).removeClass('disabled');
			return false;
		}

		Meteor.call('deletePerson', this._id, function(error) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				MyLog("person_details.js/1", "delete person", {'_id': this._id});
				Router.go('/persons');
				Session.set('form_update', false);
			}
		});
	},

	'click #icon-heart': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a person to your favorities');
			return false;
		}

		if ( isFav(this.favs) ) {
			Persons.update(this._id,
				{
					$pull: { favs: user._id },
					$inc: { favs_cnt: -1 }
				}
			);
			MyLog("person_details.js/click #icon-heart/1", "remove from favs");
		} else {
			Persons.update(this._id,
				{
					$addToSet: { favs: user._id },
					$inc: { favs_cnt: 1 }
				}
			);
			MyLog("person_details.js/click #icon-heart/1", "add to favs");
		}
	},

	'click #icon-star': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a person to your "star" list');
			return false;
		}

		if ( isStar(this.stars) ) {
			Persons.update(this._id, { $pull: { stars: user._id }, $inc: { stars_cnt: -1 } } );
			MyLog("person_details.js/click #icon-star/2", "remove from stars");
		} else {
			Persons.update(this._id, { $addToSet: { stars: user._id }, $inc: { stars_cnt: 1 } } );
			MyLog("person_details.js/click #icon-star/1", "remove from stars");
		}
	}

	//	'click #btnEditToggle': function(e) {
//		e.preventDefault();
//
//		Session.set('form_update', !Session.get('form_update'));
//	}

//	'click #btnUpdatePerson': function(e) {
//		e.preventDefault();
//		$(e.target).addClass('disabled');
//
//		if(!Meteor.user()){
//			throwError('You must login to update a Person');
//			$(e.target).removeClass('disabled');
//			return false;
//		}
//
//		// GET INPUT
//		var name= $('#name').val();
//		var birth_date = formatReleaseDateForSave( $('#birth_date').val() );
//
//		var properties = {
//			name: name
//			, birth_date: birth_date
//		};
//
//		// VALIDATE
//		var isInputError = validatePerson(properties);
//		if (isInputError) {
//			$(e.target).removeClass('disabled');
//			return false;
//		}
//
//		// TRANSFORM AND DEFAULTS
//		transformPerson(properties);
//
////		Meteor.call('updatePerson', _id, properties, function(error, person) {
////			if(error){
////				console.log(JSON.stringify(error));
////				throwError(error.reason);
////				$(e.target).removeClass('disabled');
////			}else{
////				MyLog("person_details.js/1", "updated person", {'_id': _id, 'title': person.name});
////				Router.go('/person/'+_id);
////			}
////		});
//		//???
////		Persons.update({
////			_id: this._id
////		}, {
////			$set: properties
////		});
//		Session.set('form_update', false);
//		MyLog("person_details.js/1", "updated person", {'_id': this._id, 'name': this.name});
//		//Router.go('/person/'+this._id);
//	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_person_detail.rendered = function() {
	$("#name").focus();

	$('#div-birth_date .input-append.date').datepicker({
		autoclose: true,
		todayHighlight: true
	}).on('changeDate', function(e) {
			var _id = this.dataset._id;
			var birth_date = formatReleaseDateForSave( $('#birth_date').val() );
			MyLog('person_details.js/changeDate/1', 'data', {_id: _id, birth_date: birth_date});
			try {
				Persons.update(_id, {$set: {'birth_date': birth_date, 'updated': getNow()}} );
			} catch (err) {
				throwError(JSON.stringify(err));
			}
	});

	$('.editable:not(.editable-click)').editable('destroy').editable({
		success: function(response, newValue) {
			// GET INPUT
			var _id = this.dataset._id;
			var field = $(this).attr('id');
			var v = (_.isString(newValue)) ? newValue.trim() : newValue;
			var fieldObj = _.object([field, 'updated'], [v, getNow()]);

			try {
				Persons.update(_id, {$set: fieldObj} );
			} catch (err) {
				throwError(JSON.stringify(err));
			}
		},
		validate: function(value) {
			var field = $(this).attr('id');
			if ( field==='name' )
				return validatePersonName(value);
		}
	});
};