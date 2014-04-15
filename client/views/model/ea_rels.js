EANounsFilter = new Meteor.FilterCollections(EA_Relationships, {
	name: 'ea-relationships',
	template: 'ea_rels',
	pager: {
		options: [50],
		itemsPerPage: 50,
		currentPage: 1,
		showPages: 10
	},
	sort: {
		defaults: [
			['source', 'asc']
		]
	},
	//	 {source:"Business_Actor"            ,semantic:"sends data to"    ,r_semantic:"receives data"  ,target:"Business_Actor"         ,rel_name:"flow"          }
	filters: {
		"rel_name": {
			title: 'Rel Name',
			condition: '$and',
			searchable: 'optional'
		},
		"source": {
			title: 'Source',
			operator: ['$regex', 'i'],
			condition: '$or',
			searchable: 'required'
		},
		"target": {
			title: 'Target',
			operator: ['$regex', 'i'],
			condition: '$or',
			searchable: 'required'
		}
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.ea_rels.helpers({
	userId: function() {
		return Meteor.userId();
	},
	source_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(this.source).icon;
	},
	target_icon: function() {
		return "glyphicon glyphicon-" + ea.getClassBelongsToArea(this.target).icon;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.ea_rels.events({
	'click button.btn.btn-info': function() {
		bootbox.dialog({
			title: "Search Help"
			,message: "<h3>Model Item Filtering</h3>" +
				"<ul>" +
				'<li>Click on one of the <strong>filter buttons</strong> to filter the list</li>' +
				"<li>or, type in a search string</li>" +
				'<li>to remove a filter, click on one of the <strong>active filter buttons</strong></li>' +
				'<li>All filter conditions are <strong>AND</strong>ed together</li>' +
				"</ul>" +
				"<h3>Sorting</h3>" +
				"<ul>" +
				'<li>Click on a column header to sort.  Each click will toggle between: <strong>Ascending</strong>, <strong>Desending</strong>, <strong>No-sort</strong></li>' +
				'<li><strong>bug</strong>: First column header is not shown as turned-off, when another column header is selected for sorting</li>' +
				"</ul>"
			,buttons: {
				main: {
					label: "OK",
					className: "btn-primary",
					callback: function() {
					}
				}
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
