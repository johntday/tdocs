/**
 * Dropdown (select/options) data
 * sorts are related to query.js
 */
getPersonSortingOptions = function() {
	return [{id:'name',label:'name'},{id:'click_cnt',label:'most viewed'},{id:'favs_cnt',label:'most favs'}];
};
getUserSortingOptions = function() {
	return [{id:'username',label:'username'}];
};
getTdocStatusOptions = function() {
	return [{id:STATUS_PENDING,label:'Pending'},{id:STATUS_APPROVED,label:'Approved'},{id:STATUS_REJECTED,label:'Rejected'}];
};
getTdocSortingOptions = function() {
	return [{id:'title',label:'title'},{id:'created',label:'created'},{id:'updated',label:'updated'},{id:'click_cnt',label:'most viewed'},{id:'favs_cnt',label:'most favs'},{id:'seen_cnt',label:'most viewed'},{id:'stars_cnt',label:'most starred'}];
};
getDiagramStatusOptions = function() {
	return getTdocStatusOptions();
};
getDiagramSortingOptions = function() {
	return getTdocSortingOptions();
};
getGlossaryStatusOptions = function() {
	return getTdocStatusOptions();
};
getGlossarySortingOptions = function() {
	return getTdocSortingOptions();
};


getUserprofStatusOptions = function() {
	return [{id:STATUS_USERPROF_ACTIVE,label:'Active'},{id:STATUS_USERPROF_INACTIVE,label:'INACTIVE'}];
};
