Template.tmplSidebar.helpers({
});

Template.tmpl_accordian_test.helpers({
});

Template.tmplSidebar.events({
	'click #hide-sidebar': function(e, template) {
		e.preventDefault();

		Session.set('has_sidebar', false);
	},
	'click .glyphicon .glyphicon-plus': function(e) {
		e.preventDefault();
	}
});

Template.tmpl_bus_layer.rendered = function() {
	var data = [
		{
			label: 'BUSINESS CAPABILITIES',
			children: [
				{ label: 'child1' },
				{ label: 'child2' }
			]
		},
		{
			label: 'SOMETHING ELSE',
			children: [
				{ label: 'child3' }
			]
		}
	];

	var $busCap = $('#business-capability');
	var business_capabilities = Nouns.find({project_id: getProjectId(), class_name: ea.eaType.Business_Capability}).fetch();
	data = toNodeArray( business_capabilities, "BUSINESS CAPABILITIES" );

//	if (!Template['tmpl_bus_layer'].bus_cap) {

		Template['tmpl_bus_layer'].bus_cap = $busCap.tree({
			data: data
			,autoOpen: true
			,dragAndDrop: true
			//,saveState: true
			,slide: true
			,selectable: true
			,onCanMove: function(node) {
				if (! node.parent.parent) {
					// Example: Cannot move root node
					return false;
				} else {
					return true;
				}
			}

		});
		$busCap.bind(
			'tree.select',
			function(event) {
				if (event.node && event.node.id) {
					// node was selected
					var node = event.node;
					Router.go('/nouns/'+node.id);
					$busCap.tree('selectNode', null);
				} else {
					// event.node is null
					// a node was deselected
					// e.previous_node contains the deselected node
				}
			}
		);
		$busCap.bind(
			'tree.contextmenu',
			function(event) {
				// The clicked node is 'event.node'
				var node = event.node;
				//alert(node.name);
				bootbox.dialog({
					title: "Context Menu",
					message: 'What to do with "' + node.name + '"',
					buttons: {
						main: {
							label: "Cancel",
							className: "btn-default",
							callback: function() {
							}
						},
						remove: {
							label: "Delete",
							className: "btn-danger",
							callback: function() {
							}
						}
					}
				});
			}
		);

//	} else {
//		$busCap.tree('loadData', data);
//	}
};

Template.tmpl_bus_layer.destroyed = function() {
	Template['tmpl_bus_layer'].bus_cap = null;
};