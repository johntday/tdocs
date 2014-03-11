refreshBusCap = function() {
	if (sidebar.bus_capabilities && sidebar.bus_capabilities._cnt) { sidebar.bus_capabilities.destroy(); sidebar.bus_capabilities=null; }
	var root = Nouns.findOne({class_name: ea.class_name.Business_Capability, business_capability_level:"-1"});
	var treeData = getTree( root );
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
	//EVENTS
	//create node
	$bus_capabilities.on("create_node.jstree", function(e, data) {
		console.log('create node: '+data.position, data.parent, data.node);

		var properties = {
			title: data.node.text
			,class_name: ea.class_name.Business_Capability
			,project_id: getProjectId()
		};

		Meteor.call('createNoun', properties, data.parent, function(error, noun) {
			if(error){
				growl(error.reason);
			}else{
				growl( "created "+ea.class_name.Business_Capability, {type:'s', hideSnark:true} );
			}
		});

	});
};
