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
	$('#jstree').jstree();

	$('#jstree').on("changed.jstree", function (e, data) {
		console.log(data.selected);
	});

	$('button').on('click', function () {
		$('#jstree').jstree(true).select_node('child_node_1');
		$('#jstree').jstree('select_node', 'child_node_1');
		$.jstree.reference('#jstree').select_node('child_node_1');
	});
};

Template.tmpl_bus_layer.destroyed = function() {
	Template['tmpl_bus_layer'].bus_cap = null;
};