MyLog = function(codePath, name, object) {
	if (isMyDebug) {
		if (object)
			console.log(codePath + " [" + name + "] " + JSON.stringify(object));
		else
			console.log(codePath + " [" + name + "]");
	}
};
searchRouteLogic = function() {
//	if ( _.contains(['/sciFiMovies','/timelines','/persons','/favs','/stars'], Location._state.path) ) {
//		Router.go(Location._state.path);
//	} else {
//		Router.go('/sciFiMovies');
//	}
//	Meteor.MyClientModule.scrollToTopOfPageFast();
	throwError("Search not implemented yet");
};
getNow = function() {
	return new Date().getTime();
};
setDefault = function(value, defaultValue) {
	return (value) ? value : defaultValue;
};
getMovieStatusLabel = function(status_id) {
	var s = _.find( getMovieStatusOptions(),
		function(obj){
			return (obj.id === status_id);
		}
	);
	return (s) ? s.label : '';
};
formatReleaseDateForDisplay = function(textDate/*YYYY-MM-DD*/) {
	if (! textDate)
		return "";
	return moment(textDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
};
formatReleaseDateForSave = function(textDate/*MM/DD/YYYY*/) {
	if (! textDate)
		return "";
	return moment(textDate, 'MM/DD/YYYY').format('YYYY-MM-DD');
};
isFav = function(favs) {
	var user = Meteor.user();
	if(!user) return false;
	return _.contains(favs, user._id);
};
hasSeen = function(seen) {
	var user = Meteor.user();
	if(!user) return false;
	return _.contains(seen, user._id);
};
isStar = function(stars) {
	var user = Meteor.user();
	if(!user) return false;
	return _.contains(stars, user._id);
};
getSetting = function(view, name, valueDefault) {
	var user = Meteor.user();
	if (!user || !user.settings)
		return valueDefault;
	for (var i=0; i < user.settings.length; i++) {
		if ( view===user.settings[i].view && name===user.settings[i].name )
			return user.settings[i].value;
	}
	return valueDefault;
};
setSetting = function(view, name, value) {
	Meteor.users.update(
		Meteor.userId(),
		{ $addToSet: { settings: {view:view, name:name, value:value} } }
	);
};
addFav = function(collection, _id, userId){
	collection.update(_id,
		{ $addToSet: { favs: userId }, $inc: { favs_cnt: 1 } }
	);
};
deleteFav = function(collection, _id, userId){
	collection.update(_id,
		{ $pull: { favs: userId }, $inc: { favs_cnt: -1 } }
	);
};
addSeen = function(collection, _id, userId){
	collection.update(_id,
		{ $addToSet: { seen: userId }, $inc: { seen_cnt: 1 } }
	);
};
deleteSeen = function(collection, _id, userId){
	collection.update(_id,
		{ $pull: { seen: userId }, $inc: { seen_cnt: -1 } }
	);
};
addStar = function(collection, _id, userId){
	collection.update(_id,
		{ $addToSet: { stars: userId }, $inc: { stars_cnt: 1 } }
	);
};
deleteStar = function(collection, _id, userId){
	collection.update(_id,
		{ $pull: { stars: userId }, $inc: { stars_cnt: -1 } }
	);
};
// CLIENT TEMPLATE HELPERS
dateAgo =function(value) {
	return (value) ? moment(value).fromNow() : 'never';
};
// ---------------------------------- String Helper Functions ----------------------------------- //
cleanUp = function(s){
	return stripHTML(s).trim();
};
stripHTML = function(s){
	return s.replace(/<(?:.|\n)*?>/gm, '');
};
trimWords = function(s, numWords) {
	expString = s.split(/\s+/,numWords);
	if(expString.length >= numWords)
		return expString.join(" ")+"…";
	return s;
};