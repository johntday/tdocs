/**
 * Dropdown (select/options) data
 * sorts are related to query.js
 */
getSimpleStatusOptions = function() {
	return [{id:STATUS_PENDING,label:'Pending'},{id:STATUS_APPROVED,label:'Approved'},{id:STATUS_REJECTED,label:'Rejected'}];
};
getPersonSortingOptions = function() {
	return [{id:'name',label:'name'},{id:'click_cnt',label:'most viewed'},{id:'favs_cnt',label:'most favs'}];
};
getUserSortingOptions = function() {
	return [{id:'username',label:'username'}];
};
getTdocStatusOptions = function() {
	return getSimpleStatusOptions();
};
getTdocSortingOptions = function() {
	return [{id:'title',label:'title'},{id:'created',label:'created'},{id:'updated',label:'updated'},{id:'click_cnt',label:'most viewed'},{id:'favs_cnt',label:'most favs'},{id:'seen_cnt',label:'most viewed'},{id:'stars_cnt',label:'most starred'}];
};
getDiagramStatusOptions = function() {
	return getSimpleStatusOptions();
};
getDiagramSortingOptions = function() {
	return getTdocSortingOptions();
};
getGlossaryStatusOptions = function() {
	return getSimpleStatusOptions();
};
getGlossarySortingOptions = function() {
	return getTdocSortingOptions();
};
getTableStatusOptions = function() {
	return getSimpleStatusOptions();
};
getTableSortingOptions = function() {
	return getTdocSortingOptions();
};
getProjectStatusOptions = function() {
	return getSimpleStatusOptions();
};
getProjectSortingOptions = function() {
	return [{id:'title',label:'title'},{id:'created',label:'created'},{id:'updated',label:'updated'},{id:'click_cnt',label:'most viewed'},{id:'favs_cnt',label:'most favs'},{id:'seen_cnt',label:'most viewed'},{id:'stars_cnt',label:'most starred'}];
};
getSeqDgmThemOptions = function() {
	return [{id:'hand',label:'hand'},{id:'simple',label:'simple'}];
};


getUserprofStatusOptions = function() {
	return [{id:STATUS_USERPROF_ACTIVE,label:'Active'},{id:STATUS_USERPROF_INACTIVE,label:'INACTIVE'}];
};
