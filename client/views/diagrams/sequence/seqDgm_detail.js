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
	'click #btnEditToggle': function(e) {
		e.preventDefault();
		Session.set('form_update', true);
	},

	'click #btnCancelDiagram': function(e) {
		e.preventDefault();
		Session.set('form_update', false);
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
				growl( "Diagram deleted", {type:'s', hideSnark:true} );
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
		if (e.type === "keyup" /*&& e.which === 13*/) {
			try {
				var options = (this.theme) ? {theme: this.theme} : {theme: 'simple'};
				var diagram = Diagram.parse( $(e.target).val() );
				$('#diagram').html('');
				diagram.drawSVG('diagram', options);
			} catch (err) {
			}
		}
	},

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
			type: TYPES.sequenceDiagram
			, title: $('#title').val()
			, description: $('#description').val()
			, theme: $('#theme').val()
			, code: $('#code').val()
		};

		if ( isAdmin(Meteor.user()) ) {
			_.extend(properties, {
				status: $('#status').val()
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
				MyLog("diagram_details.js/1", "updated diagram", {'error': error, 'diagram': diagram});
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				growl( "Diagram updated", {type:'s', hideSnark:true} );
				MyLog("diagram_details.js/1", "updated diagram", {'_id': _id, 'diagram': diagram});
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_diagram_detail.rendered = function() {
	try {
		var options = (this.data.theme) ? {theme: this.data.theme} : {theme: 'simple'};
		var diagram = Diagram.parse( this.data.code );
		diagram.drawSVG('diagram', options);
	} catch (err) {
		throwError('There is a problem with your "Diagram Text"');
	}

	$('#description').focus();
	$('#code').focus();
	if ( !Session.get('form_update') )
		$("#code").blur();
};
/*------------------------------------------------------------------------------------------------------------------------------*/
//Template.tmpl_diagram_detail.created = function() {
//	console.log( this.data._id );
//	Diagrams.update(this.data._id, {$inc: {click_cnt: 1}})
//};
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_diagram_detail.destroyed = function() {
	incClickCnt(Diagrams, this.data._id);
};
