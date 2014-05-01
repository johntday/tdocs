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
	},
	area: function() {
		return ea.getAreaName(this.area_code);
	},
	addRel: function() {
		return Session.get('add_rel');
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_noun_detail.events({
	'keyup #title, keyup #description': function(e) {
		if (e.which === 13)
			$('#btnUpdateNoun').click();
	},
	'click #area': function(e) {
		e.preventDefault();
		gotoNounFilterPage('area_code', {value:this.area_code, condition:'$and'});
	},
	'click #class_name': function(e) {
		e.preventDefault();
		gotoNounFilterPage('class_name', {value:this.class_name, condition:'$and'});
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
		var noun = getSelectedTreeItem(true);

		Meteor.call('deleteNoun', this, noun.parent, ea.getClassBelongsToArea(this.class_name).children_name, function(error, _id) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				sidebar[noun.original.class_name].delete_node(noun.id);
				Router.go('/nouns');
			}
		});
	},
	'click a': function(e) {
		e.preventDefault();
		var link = $(e.currentTarget).attr('href');
		if (link && link !== '#') {
			Router.go( link );
		}
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

		Meteor.call('updateNoun', _id, properties, function(error, noun) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				growl( '"' + noun.title + '" updated', {type:'s', hideSnark:true} );
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_noun_detail.rendered = function() {
	if (graph)
		$('#noun_paper').empty();
	drawNounDiagram();
};
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_noun_detail.destroyed = function() {
	incClickCnt(Nouns, getSelectedTreeItem()._id);
};
/*---------- FUNCTIONS and VARs ------------------------------------------------------------------------------------------------*/
var createRelationship = function(target_id, rel_name) {
	var source_id = getSelectedTreeItem()._id;

	Meteor.call('createRelationship', getProjectId(), source_id, target_id, rel_name, function(error, rel_id) {
		if(error){
			growl(error.reason);
		}else{
			growl( 'Created relationship', {type:'s', hideSnark:true} );
		}
	});
}
var drawNounDiagram = function() {
	graph = new joint.dia.Graph;

	var width = $("#noun_panel_diagram").width() - 40;
	var height = 400;
	var paper = new joint.dia.Paper({
		el: $('#noun_paper'),
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
var graph;