regexQuery = function (searchText) {
	return {$regex: searchText, $options: 'i'};
};
sortQuery = function (sortProperty, sortOrder) {
	var args = Array.prototype.slice.call(arguments, 0);
	var sort = {sort: {}};

	for (var i=0; i < args.length; i++) {
		sort.sort[args[i]] = args[++i];
	}
	return sort;
};
tdocSort = {
	title: sortQuery('title', 1, 'release_date', -1)
	, click_cnt: sortQuery('click_cnt', -1, 'title', 1)
	, favs_cnt: sortQuery('favs_cnt', -1, 'click_cnt', -1, 'title', 1)
	, seen_cnt: sortQuery('seen_cnt', -1, 'click_cnt', -1, 'title', 1)
	, stars_cnt: sortQuery('stars_cnt', -1, 'click_cnt', -1, 'title', 1)
};
personSort = {
	name: sortQuery('name', 1, '_id', 1)
	, click_cnt: sortQuery('click_cnt', -1, 'name', 1)
	, favs_cnt: sortQuery('favs_cnt', -1, 'click_cnt', -1, 'name', 1)
};
findOptions = function(sort, limit) {
	return (limit) ? _.extend(sort, {limit:limit}) : sort;
};
tdocQuery = function(searchText, status) {
	return (searchText) ? {title: regexQuery(searchText)} : {};
};
favsQuery = function(searchText) {
	var userId = Meteor.userId();
	return (searchText) ? {favs: Meteor.userId(), title: regexQuery(searchText)} : {favs: ((userId) ? userId : "0")};
};
starsQuery = function(searchText) {
	var userId = Meteor.userId();
	return (searchText) ? {stars: Meteor.userId(), title: regexQuery(searchText)} : {stars: ((userId) ? userId : "0")};
};
personQuery = function(searchText) {
	return (searchText) ? {name: regexQuery(searchText)} : {};
};

updateClickCnt = function(collection, _id) {
	collection.update(_id, { $inc: { click_cnt: 1 }});
	return true;
};