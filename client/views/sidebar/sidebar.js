Template.tmplSidebar.events({
	'click #hide-sidebar': function(e, template) {
		e.preventDefault();

		Session.set('has_sidebar', false);
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
	'dblclick li': function(e) {
		var ref = sidebar.bus_capabilities,
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		if (sel !== 'root')
			Router.go('/nouns/'+sel);
	},
	'click button.btn.btn-success.btn-sm': function(e) {
		var ref = sidebar.bus_capabilities,
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		sel = ref.create_node(sel);
		if(sel) {
			ref.edit(sel);
		}
	},
	'click button.btn.btn-warning.btn-sm': function(e) {
		var ref = sidebar.bus_capabilities,
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		ref.edit(sel);
	},
	'click button.btn.btn-danger.btn-sm': function(e) {
		var ref = sidebar.bus_capabilities,
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		ref.delete_node(sel);
	}

});
Template.tmpl_bus_layer.rendered = function() {
	if (!sidebar.bus_capabilities) {
		var level0 = Nouns.find({class_name: ea.class_name.Business_Capability, business_capability_level:"0"}).fetch();
		var level1 = getChildren( level0[0] );
		console.log(level1);
		var data = [{id:'root', text:"BUSINESS CAPABILITIES", type:"root", children:level0}];

		$('#bus-capabilities').jstree({
			"core" : {
				"animation" : 0
				,"check_callback" : true
				,"themes" : { "stripes" : true }
				,'data' : data
			},
			"types" : {
				"#" : {
					"valid_children" : ["root"]
				}
				,"root" : {
					"icon" : "glyphicon glyphicon-certificate"
					,"valid_children" : ["default"]
				}
				,"default" : {
					"icon" : "glyphicon glyphicon-flag"
				}
			},
			"plugins" : [
				"dnd", "search", "state", "types", "wholerow"
			]
		});

		sidebar.bus_capabilities = $('#bus-capabilities').jstree(true);
	}

};

//Template.tmpl_bus_layer.destroyed = function() {
//	Template['tmpl_bus_layer'].bus_capabilities = null;
//};
function packageChildren(noun) {

}
function getChildren(noun) {
	var descendants=[]
	var stack=[];
	var item = Nouns.findOne({instance_name:noun.instance_name});
	stack.push(item);
	while (stack.length>0){
		var currentnode = stack.pop();
		var children = [];
		if (currentnode && currentnode.contained_business_capabilities)
			children = Nouns.find({instance_name:{$in:currentnode.contained_business_capabilities}});

		children.forEach(function(child) {
			descendants.push(child);
			if(child && child.contained_business_capabilities && child.contained_business_capabilities.length>0){
				stack.push(child);
			}
		});
	}

	return descendants;
}
function mapToTree(noun) {
	return {id:noun._id, text:noun.title};
}