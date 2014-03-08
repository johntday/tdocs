regexQuery = function (searchText) {
	return {$regex: searchText, $options: 'i'};
};
findUsersByRoles = function(project_id, exists, role) {
	var query = {};
	if (role)
		query["roles." + project_id] = role;
	else
		query["roles." + project_id] = {$exists: exists};
	return query;
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
	title: sortQuery('title', 1, '_id', 1)
	, created: sortQuery('created', -1)
	, updated: sortQuery('updated', -1)
	, click_cnt: sortQuery('click_cnt', -1, 'title', 1)
	, favs_cnt: sortQuery('favs_cnt', -1, 'click_cnt', -1, 'title', 1)
	, seen_cnt: sortQuery('seen_cnt', -1, 'click_cnt', -1, 'title', 1)
	, stars_cnt: sortQuery('stars_cnt', -1, 'click_cnt', -1, 'title', 1)
};
diagramSort = tdocSort;
glossarySort = tdocSort;
tableSort = tdocSort;
projectSort = tdocSort;
nounSort = {
	title: sortQuery('title', 1, '_id', 1)
};
personSort = {
	name: sortQuery('name', 1, '_id', 1)
	, click_cnt: sortQuery('click_cnt', -1, 'name', 1)
	, favs_cnt: sortQuery('favs_cnt', -1, 'click_cnt', -1, 'name', 1)
};
findOptions = function(sort, limit) {
	return (limit) ? _.extend(sort, {limit:limit}) : sort;
};

tdocQuery = function(searchText) {
	return (searchText) ? {title: regexQuery(searchText)} : {};
};
diagramQuery = function(searchText) {
	return tdocQuery(searchText);
};
glossaryQuery = function(searchText) {
	return tdocQuery(searchText);
};
tableQuery = function(searchText) {
	return tdocQuery(searchText);
};
projectQuery = function(searchText) {
	return {_id: {$in: getUserProjects()} };
};


favsQuery = function(searchText) {
	var userId = Meteor.userId();
	return (searchText) ? {favs: Meteor.userId(), title: regexQuery(searchText)} : {favs: ((userId) ? userId : "0")};
};
starsQuery = function(searchText) {
	var userId = Meteor.userId();
	return (searchText) ? {stars: Meteor.userId(), title: regexQuery(searchText)} : {stars: ((userId) ? userId : "0")};
};
