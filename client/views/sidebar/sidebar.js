Template.tmplSidebar.events({
	'click #hide-sidebar': function(e, template) {
		e.preventDefault();

		Session.set('has_sidebar', false);
	}
});

Template.tmpl_bus_layer.helpers({
	pickedProject: function() {
		return Meteor.user() && !!getProjectId();
	},
	chevronLeft: function() {
		return (Session.get('sidebar_nbr') > 2);
	},
	chevronRight: function() {
		return (Session.get('sidebar_nbr') < 10);
	}
});

Template.tmpl_bus_layer.events({
//	'keyup #demo_q': function(e) {
//		if (to) { Meteor.clearTimeout(to); }
//		to = Meteor.setTimeout(function(){
//			var v = $(e.currentTarget).val();
//			$('#bus-capabilities').jstree(true).search(v);
//		}, 250);
//	}
	'click button.btn.btn-default.btn-sm': function(e) {
		e.preventDefault();
		var ref = sidebar.bus_capabilities,
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		Router.go('/nouns/'+sel);
	},
	'click #btn-sidebar-help': function() {
		bootbox.dialog({
			title: "Sidebar Help"
			,message: "<h3>Buttons</h3>" +
				"<ul>" +
				"<li><button class='btn btn-info btn-sm'><span class='glyphicon glyphicon-question-sign'></span> </button> This help dialog</li>" +
				"<li><button class='btn btn-success btn-sm'><span class='glyphicon glyphicon-plus'></span> </button> Add an item under selected parent</li>" +
				"<li><button class='btn btn-warning btn-sm'><span class='glyphicon glyphicon-pencil'></span> </button> Edit title of the selected item</li>" +
				"<li><button class='btn btn-danger btn-sm'><span class='glyphicon glyphicon-remove'></span> </button> Delete the selected item</li>" +
				"<li><button class='btn btn-default btn-sm'><span class='glyphicon glyphicon-arrow-right'></span> </button> Goto selected item</li>" +
				"</ul>" +
				"<h3>Actions</h3>" +
				"<ul>" +
					"<li><b>Drag and Drop</b>: select and move item to drop to another spot</li>" +
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
	},
	'click button.btn.btn-success.btn-sm': function(e) {
		var ref = sidebar.bus_capabilities,
			sel = ref.get_selected();
		console.log('hi');
		if(!sel.length) { growl("Select a parent item first.  Your new item will be place under this parent"); return false; }
		sel = sel[0];
		sel = ref.create_node(sel);
		if(sel) {
			ref.edit(sel);
		} else
			growl("Select a parent item first.  Your new item will be place under this parent");

	},
	'click button.btn.btn-warning.btn-sm': function(e) {
		var ref = sidebar.bus_capabilities,
			sel = ref.get_selected(true);
		if(!sel.length) { growl("Select an item first"); return false; }
		sel = sel[0];
		if (sel.type !== 'root')
			ref.edit(sel);
		else
			growl("Cannot edit this item");
	},
	'click button.btn.btn-danger.btn-sm': function(e) {
		var ref = sidebar.bus_capabilities,
			sel = ref.get_selected(true);
		if(!sel.length) { growl("Select an item first"); return false; }
		sel = sel[0];
		if (sel.type !== 'root' && sel.type !== 'top') {
			ref.delete_node(sel);
		} else
			growl("Cannot delete this item");
	},
	'click #sidebar_left': function() {
		var nbr = Session.get('sidebar_nbr');
		if (nbr > 2)
			Session.set('sidebar_nbr', (nbr-1) );
	},
	'click #sidebar_right': function() {
		var nbr = Session.get('sidebar_nbr');
		if (nbr < 10)
			Session.set('sidebar_nbr', (nbr+1) );
	}

});

Template.tmpl_bus_layer.rendered = function() {
	var root = Nouns.findOne({class_name: ea.class_name.Business_Capability, business_capability_level:"-1"});
	var treeData = getTree( root );
	var $bus_capabilities = $('#bus-capabilities');
	$bus_capabilities.jstree({
		"core" : {
			"animation" : 0
			,"check_callback" : true
			,"themes" : { "stripes" : true }
			,'data' : treeData
		},
		"types" : {
			"#" : {
				"valid_children" : ["root"]
			}
			,"root" : {
				"icon" : "glyphicon glyphicon-certificate"
				//,"valid_children" : ["default"]
			}
			,"top" : {
				"icon" : "glyphicon glyphicon-flag"
				//,"valid_children" : ["default"]
			}
			,"default" : {
				"icon" : "glyphicon glyphicon-flag"
			}
		},
		"plugins" : [
			"dnd", "search", "state", "types", "wholerow"
		]
	});
	sidebar.bus_capabilities = $bus_capabilities.jstree(true);
//	$bus_capabilities.on("select_node.jstree", function() {
//		var ref = sidebar.bus_capabilities,
//			sel = ref.get_selected();
//		if(!sel.length) { return false; }
//		sel = sel[0];
//		Router.go('/nouns/'+sel);
//	});
};

function getTree(noun) {
	if (!noun) return;
	var descendants=[]
	var stack=[];
	var item = Nouns.findOne({instance_name:noun.instance_name});
	stack.push(item);
	while (stack.length>0){
		var currentnode = stack.pop();
		_.extend(currentnode, {id: currentnode._id, text:currentnode.title});
		var children = [];
		if (currentnode && currentnode.contained_business_capabilities)
			children = Nouns.find({instance_name:{$in:currentnode.contained_business_capabilities}}).fetch();

		children.forEach(function(child) {
			_.extend(child, {id: child._id, text:child.title});
			descendants.push(child);
			if(child && child.contained_business_capabilities && child.contained_business_capabilities.length>0){
				stack.push(child);
			}
		});
		_.extend(currentnode, {children: children});
	}
	return item;
}

//Template.tmpl_bus_layer.destroyed = function() {
//	sidebar.bus_capabilities = null;
//};
