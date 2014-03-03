Template.tmplSidebar.helpers({
});

Template.tmpl_accordian_test.helpers({
});

Template.tmplSidebar.events({
	'click #hide-sidebar': function(e, template) {
		e.preventDefault();

		Session.set('has_sidebar', false);
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
	var business_capabilities = Nouns.find({project_id: getProjectId(), type: ea.eaType.Business_Capability}).fetch();
	data = toNodeArray( business_capabilities, "BUSINESS CAPABILITIES" );

//	if (!Template['tmpl_bus_layer'].bus_cap) {

		Template['tmpl_bus_layer'].bus_cap = $busCap.tree({
			data: data
			,autoOpen: 0
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
				console.log( $busCap.tree('toJson') );
			}
		);

//	} else {
//		$busCap.tree('loadData', data);
//	}
};

Template.tmpl_bus_layer.destroyed = function() {
	Template['tmpl_bus_layer'].bus_cap = null;
};