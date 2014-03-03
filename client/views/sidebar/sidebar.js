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
			label: 'node1',
			children: [
				{ label: 'child1' },
				{ label: 'child2' }
			]
		},
		{
			label: 'node2',
			children: [
				{ label: 'child3' }
			]
		}
	];

	$('#business-capability').tree({
		data: data
		,autoOpen: 0
		,dragAndDrop: true
		,saveState: true
	});
};
