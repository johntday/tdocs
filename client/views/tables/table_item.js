Template.tmpl_table_item.helpers({
    thumbnail: function() {
	    return (this.thumbnail) ? this.thumbnail : "/img/BumbleBee_60x60.png";
    },
	tableLink: function() {
		return "/tables/" + this._id;
	},
	ownerLink: function() {
		return "/person/" + this.userId;
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
	isAdmin: function() {
		return isAdmin(Meteor.user());
	},
	click_cnt: function() {
		return (this.click_cnt) ? this.click_cnt : 0;
	},
	statusLabel: function() {
		return getTdocStatusLabel(this.status);
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
	lastUpdAgo: function() {
		return (this.updated) ? moment(this.updated).fromNow() : moment(this.created).fromNow();
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
