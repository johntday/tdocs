Template.tmpl_person_item.helpers({
	thumbnail: function() {
		return (this.thumbnail) ? this.thumbnail : "/img/Minion-Amazed-icon91.png";
	},
	personLink: function() {
		return "/person/" + this._id;
	},
	click_cnt: function() {
		return (this.click_cnt) ? this.click_cnt : 0;
	},
	favs_cnt: function() {
		return (this.favs_cnt && this.favs_cnt > -1) ? this.favs_cnt : 0;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
//Template.tmpl_person_item.rendered = function(){
//	// animate post from previous position to new position
//	var instance = this;
//	var rank = instance.data._rank;
//	var $this = $(this.firstNode);
//	var postHeight = 80;
//	var newPosition = rank * postHeight;
//
//	// if element has a currentPosition (i.e. it's not the first ever render)
//	if (typeof(instance.currentPosition) !== 'undefined') {
//		var previousPosition = instance.currentPosition;
//		// calculate difference between old position and new position and send element there
//		var delta = previousPosition - newPosition;
//		$this.css("top", delta + "px");
//	} else {
//		// it's the first ever render, so hide element
//		$this.addClass("invisible");
//	}
//
//	// let it draw in the old position, then..
//	Meteor.defer(function() {
//		instance.currentPosition = newPosition;
//		// bring element back to its new original position
//		$this.css("top",  "0px").removeClass("invisible");
//	});
//};
/*------------------------------------------------------------------------------------------------------------------------------*/
//Template.tmpl_person_item.events({
//	'click .upvotable': function(e) {
//		e.preventDefault();
//		Meteor.call('upvote', this._id);
//	}
//});
//
//Template.tmpl_person_item.preserve({
//	'.post': function (node) {return node.id; }
//});
