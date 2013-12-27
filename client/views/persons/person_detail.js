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
	canEditAndEditToggle: function() {
		return canEdit(Meteor.user(), this) && Session.get('form_update');
	},
	createdAgo: function() {
		return (this.created) ? moment(this.created).fromNow() : this.created;
	},
	updatedAgo: function() {
		return (this.updated) ? moment(this.updated).fromNow() : this.updated;
	},
	statusOptions: function() {
		return getMovieStatusOptions();
	},
	formattedBirthDate: function() {
		return formatReleaseDateForDisplay(this.birth_date);
	},
	hasMovies: function() {
		return (this.movies && this.movies.length > 0);
	},
	thumbnail: function() {
		return this.posters.thumbnail;
	},
	movieLink: function() {
		return "/sciFiMovies/" + this._id;
	},
	click_cnt: function() {
		return (this.click_cnt) ? this.click_cnt : 0;
	},
	isFav: function() {
		return isFav(this.favs);
	},
	click_cnt: function() {
		return (this.click_cnt) ? this.click_cnt : 0;
	},
	favs_cnt: function() {
		return (this.favs_cnt && this.favs_cnt > -1) ? this.favs_cnt : 0;
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

	'click #btnEditToggle': function(e) {
		e.preventDefault();

		Session.set('form_update', !Session.get('form_update'));
	},

	'click #btnUpdatePerson': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to update a Person');
			$(e.target).removeClass('disabled');
			return false;
		}

		// GET INPUT
		var name= $('#name').val();
		var birth_date = formatReleaseDateForSave( $('#birth_date').val() );

		var properties = {
			name: name
			, birth_date: birth_date
		};

		// VALIDATE
		var isInputError = validatePerson(properties);
		if (isInputError) {
			$(e.target).removeClass('disabled');
			return false;
		}

		// TRANSFORM AND DEFAULTS
		transformPerson(properties);

//		Meteor.call('updatePerson', _id, properties, function(error, person) {
//			if(error){
//				console.log(JSON.stringify(error));
//				throwError(error.reason);
//				$(e.target).removeClass('disabled');
//			}else{
//				MyLog("person_details.js/1", "updated person", {'_id': _id, 'title': person.name});
//				Router.go('/person/'+_id);
//			}
//		});
		//???
//		Persons.update({
//			_id: this._id
//		}, {
//			$set: properties
//		});
		Session.set('form_update', false);
		MyLog("person_details.js/1", "updated person", {'_id': this._id, 'name': this.name});
		//Router.go('/person/'+this._id);
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_person_detail.rendered = function() {
	$("#name").focus();

	$('#div-birth_date .input-append.date').datepicker({
		autoclose: true,
		todayHighlight: true
	});

	if ( Session.get('form_update') ) {
		$("#btnEditToggle").addClass("active");
	} else {
		$("#btnEditToggle").removeClass("active");
	}
};