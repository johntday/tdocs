Template.tmpl_noun_detail.helpers({
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
		return getNounStatusOptions();
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
Template.tmpl_noun_detail.events({
	'click a': function(e) {
		e.preventDefault();
		var link = $(e.currentTarget).attr('href');
		if (link && link !== '#') {
			Router.go( link );
		}
	},
	'click #btnEditToggle': function(e) {
		e.preventDefault();
		Session.set('form_update', true);
	},
	'click #btnCancelNoun': function(e) {
		e.preventDefault();
		Session.set('form_update', false);
	},
	'click #btnDeleteNoun': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to delete a '+this.class_name);
			$(e.target).removeClass('disabled');
			return false;
		}

		Meteor.call('deleteNoun', this._id, function(error) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				growl( "Deleted "+this.class_name, {type:'s', hideSnark:true} );
				Router.go('/');
			}
		});
	},

	'click #icon-heart': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a '+this.class_name+' to your favorities');
			return false;
		}

		if ( isFav(this.favs) ) {
			Nouns.update(this._id,
				{
					$pull: { favs: user._id },
					$inc: { favs_cnt: -1 }
				}
			);
			MyLog("noun_details.js/click #icon-heart/1", "remove from favs");
		} else {
			Nouns.update(this._id,
				{
					$addToSet: { favs: user._id },
					$inc: { favs_cnt: 1 }
				}
			);
			MyLog("noun_details.js/click #icon-heart/1", "add to favs");
		}
	},

	'click #icon-eye': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a '+this.class_name+' to your "seen it" list');
			return false;
		}

		if ( hasSeen(this.seen) ) {
			Nouns.update(this._id, { $pull: { seen: user._id }, $inc: { seen_cnt: -1 } } );
			MyLog("noun_details.js/click #icon-eye/2", "remove from seen");
		} else {
			Nouns.update(this._id, { $addToSet: { seen: user._id }, $inc: { seen_cnt: 1 } } );
			MyLog("noun_details.js/click #icon-eye/1", "remove from seen");
		}
	},

	'click #icon-star': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a '+this.class_name+' to your "star" list');
			return false;
		}

		if ( isStar(this.stars) ) {
			Nouns.update(this._id, { $pull: { stars: user._id }, $inc: { stars_cnt: -1 } } );
			MyLog("noun_details.js/click #icon-star/2", "remove from stars");
		} else {
			Nouns.update(this._id, { $addToSet: { stars: user._id }, $inc: { stars_cnt: 1 } } );
			MyLog("noun_details.js/click #icon-star/1", "remove from stars");
		}
	},

	'keyup #description, focus #description': function(e) {
		e.preventDefault();
		var $element = $(e.target).get(0);
		$element.style.overflow = 'hidden';
		$element.style.height = 0;
		$element.style.height = $element.scrollHeight + 'px';
	},

	'click #btnUpdateNoun': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to update a '+this.class_name);
			$(e.target).removeClass('disabled');
			return false;
		}

		// GET INPUT
		var _id = this._id;

		var properties = {
			type: TYPES.noun
			, title: $('#title').val()
			, description: $('#description').val()
		};

		if ( isAdmin(Meteor.user()) ) {
			_.extend(properties, {
				status: $('#status').val()
			});
		}

		// VALIDATE and TRANSFORM
//		var isInputError = validateNoun(properties);
//		if (isInputError) {
//			$(e.target).removeClass('disabled');
//			return false;
//		}
//		transformNoun(properties);

		Meteor.call('updateNoun', _id, properties, function(error, noun) {
			if(error){
				console.log(JSON.stringify(error));
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				growl( "Noun updated", {type:'s', hideSnark:true} );
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_noun_detail.rendered = function() {
	$("#title").focus();
	$("#description").focus();
	if ( !Session.get('form_update') )
		$("#description").blur();

	drawNounDiagram();
};
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_noun_detail.destroyed = function() {
	incClickCnt(Nouns, this.data._id);
};
/*---------- FUNCTIONS and VARs ------------------------------------------------------------------------------------------------*/
var drawNounDiagram = function() {
	var graph = new joint.dia.Graph;

	var $paper = $('#noun_paper');
	var $container = $("#noun_panel_diagram");
	var width = $container.width() - 40;
	var height = 400;
	var paper = new joint.dia.Paper({
		el: $paper,
		width: width,
		height: height,
		gridSize: 1,
		model: graph
	});

	getOneAway(graph);

	if (animateFrameRequestID) {
		cancelAnimationFrame(animateFrameRequestID);
	}

	if (graph.get('cells').length === 0) {
		// There is nothing to layout.
		return;
	}

	var graphLayout = new joint.layout.ForceDirected({
		graph: graph,
		width: width - 40,
		height: height - 60,
		charge: 780,
		linkStrength: .5,
		linkDistance: (width<height) ? width/2 : height/2,
		gravityCenter: { x: width/2, y: height/2 - 40 }
	});

	graphLayout.start();

	function animate() {
		animateFrameRequestID = requestAnimationFrame(animate);
		graphLayout.step();
	}
	animate();

};

var animateFrameRequestID;
