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
	$('#bus-capabilities').jstree({
		"core" : {
			"animation" : 0
//			"check_callback" : true,
			,"themes" : { "stripes" : true }
//			'data' : {
//				'url' : function (node) {
//					return node.id === '#' ?
//					       'ajax_demo_roots.json' : 'ajax_demo_children.json';
//				},
//				'data' : function (node) {
//					return { 'id' : node.id };
//				}
//			}
		},
//		"types" : {
//			"#" : {
//				"max_children" : 1,
//				"max_depth" : 4,
//				"valid_children" : ["root"]
//			},
//			"root" : {
//				//"icon" : "/static/3.0.0-beta9/assets/images/tree_icon.png",
//				"valid_children" : ["default"]
//			},
//			"default" : {
//				"valid_children" : ["default","file"]
//			},
//			"file" : {
//				"icon" : "glyphicon glyphicon-file",
//				"valid_children" : []
//			}
//		},
		"plugins" : [
			"contextmenu", "dnd", "search", "state", "types", "wholerow"
		]
	});};

Template.tmpl_bus_layer.destroyed = function() {
	Template['tmpl_bus_layer'].bus_cap = null;
};