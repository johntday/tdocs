//var codeValue = this.code;
//var codeDep = new Deps.Dependency();
function isError(code) {
	try {
		Diagram.parse( code );
	} catch (err) {
		return true;
	}
	return false;
};

Template.tmpl_diagram_detail.helpers({
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
	createdAgo: function() {
		return dateAgo(this.created);
	},
	updatedAgo: function() {
		return dateAgo(this.updated);
	},
	statusOptions: function() {
		return getDiagramStatusOptions();
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
Template.tmpl_diagram_detail.events({
	'click #btnEditToggle, click #btnCancelDiagram': function(e) {
		e.preventDefault();
		Session.set('form_update', !Session.get('form_update'));
	},

	'click #btnDeleteDiagram': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to delete a diagram');
			$(e.target).removeClass('disabled');
			return false;
		}

		Meteor.call('deleteDiagram', this._id, function(error) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Router.go('/diagrams');
			}
		});
	},

	'click #icon-heart': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a diagram to your favorities');
			return false;
		}

		if ( isFav(this.favs) ) {
			Diagrams.update(this._id,
				{
					$pull: { favs: user._id },
					$inc: { favs_cnt: -1 }
				}
			);
			MyLog("diagram_details.js/click #icon-heart/1", "remove from favs");
		} else {
			Diagrams.update(this._id,
				{
					$addToSet: { favs: user._id },
					$inc: { favs_cnt: 1 }
				}
			);
			MyLog("diagram_details.js/click #icon-heart/1", "add to favs");
		}
	},

	'click #icon-eye': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a diagram to your "seen it" list');
			return false;
		}

		if ( hasSeen(this.seen) ) {
			Diagrams.update(this._id, { $pull: { seen: user._id }, $inc: { seen_cnt: -1 } } );
			MyLog("diagram_details.js/click #icon-eye/2", "remove from seen");
		} else {
			Diagrams.update(this._id, { $addToSet: { seen: user._id }, $inc: { seen_cnt: 1 } } );
			MyLog("diagram_details.js/click #icon-eye/1", "remove from seen");
		}
	},

	'click #icon-star': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a diagram to your "star" list');
			return false;
		}

		if ( isStar(this.stars) ) {
			Diagrams.update(this._id, { $pull: { stars: user._id }, $inc: { stars_cnt: -1 } } );
			MyLog("diagram_details.js/click #icon-star/2", "remove from stars");
		} else {
			Diagrams.update(this._id, { $addToSet: { stars: user._id }, $inc: { stars_cnt: 1 } } );
			MyLog("diagram_details.js/click #icon-star/1", "remove from stars");
		}
	},

	'keyup #code, focus #code, keyup #description, focus #description': function(e) {
		e.preventDefault();
		var $element = $(e.target).get(0);
		$element.style.overflow = 'hidden';
		$element.style.height = 0;
		$element.style.height = $element.scrollHeight + 'px';
	},

//	'keyup #title': function(e) {
//		e.preventDefault();
//		MyLog("diagram_details.js/keyup #title/1", "data", {'e.target.value': e.target.value, 'this.title': this.title, 'e.target.value != this.title': e.target.value != this.title});
//		if ( e.target.value != this.title )
//			$('#btnUpdateDiagram').click();
//	},

	'click #btnUpdateDiagram': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to update a diagram');
			$(e.target).removeClass('disabled');
			return false;
		}

		// GET INPUT
		var _id = this._id;

		// CREATE OBJECT
		var properties = {
			title: $('#title').val()
			, description: $('#description').val()
			, theme: $('#theme').val()
			, code: $('#code').val()
		};

		if ( isAdmin(Meteor.user()) ) {
			_.extend(properties, {
				status: status
			});
		}

		// VALIDATE
		var isInputError = validateDiagram(properties);
		if (isInputError) {
			$(e.target).removeClass('disabled');
			return false;
		}

		// TRANSFORM AND DEFAULTS
		transformDiagram(properties);

		Meteor.call('updateDiagram', _id, properties, function(error, diagram) {
			if(error){
				MyLog("diagram_details.js/1", "updated diagram", {'error': error, 'title': diagram.title});
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				MyLog("diagram_details.js/1", "updated diagram", {'_id': _id, 'title': diagram.title});
				//Router.go('/diagrams/'+_id);
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_diagram_detail.rendered = function() {

	$('#theme').select2({
		data: [
			{id: 'hand', text: 'hand'},
			{id: 'simple', text: 'simple'}
		],
		multiple: false,
		placeholder: "diagram theme"
//		success: function(response, newValue) {
//			//var _id = this.dataset.pk;
//		}
		//	})
		//	.on("change", function(e) {
		//		console.log("change");
	})
	.select2("val", this.data.theme)
	.select2("readonly", !canEditAndEditToggle());

	try {
		var options = (this.data.theme) ? {theme: this.data.theme} : {theme: 'simple'};
		var diagram = Diagram.parse( this.data.code );
		diagram.drawSVG('diagram', options);
	} catch (err) {
		throwError('There is a problem with your "Diagram Text"');
	}
	$('#description').focus();
	$('#code').focus();
};

//Template.tmpl_diagram_detail.created = function() {
//	codeInterval = Meteor.setInterval(function(){
//		var currentCodeValue = $('#code').val();
//		if ( Session.get('form_update') && (currentCodeValue != Session.get('diagram_code')) && !isError(currentCodeValue) ) {
//			console.log("currentCodeValue != Session.get('diagram_code')");
//			//codeValue = currentCodeValue;
//
//			Diagrams.update(Session.get('diagram_id'), {$set: {code: currentCodeValue}} );
//			//codeDep.changed();
//		}
//	}, 5000);
//};

//Template.tmpl_diagram_detail.destroyed = function() {
//	Meteor.clearInterval(codeInterval);
//};
