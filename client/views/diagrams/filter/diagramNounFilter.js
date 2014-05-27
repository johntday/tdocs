// UI:Diagrams
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.diagramNounFilter.helpers({
	userId: function() {
		return Meteor.userId();
	},
	createdAgo: function() {
		return (this.created) ? moment(this.created).fromNow() : "Never Created";
	},
	created: function() {
		return (this.created) ? moment(this.created) : "";
	},
	updatedAgo: function() {
		return (this.updated) ? moment(this.updated).fromNow() : "Never Updated";
	},
	updated: function() {
		return (this.updated) ? moment(this.updated) : "";
	},
	tables: function () {
		var query = {project_id: getProjectId(), nouns: this._id };

		return Diagrams.find(query);
	},
	tableSettings: function () {
		return {
			rowsPerPage: 15,
			showNavigation: 'auto',
			showFilter: false,
			fields: [
				{ key: 'title', label: 'Title', sort: 1, fn: function(value, object){
					var href = '/graph/' + object._id;
					return new Spacebars.SafeString('<a href="' + href + '">' + value + '</a>');
				} },
				{ key: 'description', label: 'Description' },
				{ key: 'created', label: 'Created', fn: function(value){
					return (value) ? moment(value).fromNow() : "Never Created";
				} },
				{ key: 'updated', label: 'Updated', fn: function(value){
					return (value) ? moment(value).fromNow() : "Never Updated";
				} },
				{ key: 'owner', label: 'Owner' }
			]
		};
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
