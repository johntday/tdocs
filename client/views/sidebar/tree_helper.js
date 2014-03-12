refreshBusCap = function() {
	try {
		if (sidebar.bus_capabilities/* && sidebar.bus_capabilities._cnt*/) { sidebar.bus_capabilities.destroy(); sidebar.bus_capabilities=null; }
	} catch(err) {}
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

	$bus_capabilities.on("rename_node.jstree", function(e, data) {
		if (mode === 'i') {
//			console.log('insert: ', data.node, data.text, data.old, mode);
			// INSERT
			var properties = {
				title: data.text
				,project_id: getProjectId()
				,class_name: ea.class_name.Business_Capability
			};
			Meteor.call('createNoun', properties, parent, function(error, noun) {
				if(error){
					mode = 'e';
					sidebar.bus_capabilities.delete_node(data.node);
					growl(error.reason);
				}else{
					refreshBusCap();
//					Router.go('/nouns/'+noun.nounId);
					growl( "Created "+ea.class_name.Business_Capability, {type:'s', hideSnark:true} );
				}
			});

			mode = null;
		} else if (data.text !== data.old) {
			mode === 'u';
			console.log('rename: ', data.node, data.text, data.old, mode);
			// UPDATE TITLE
		}
	});
	$bus_capabilities.on("create_node.jstree", function(e, data) {
		mode = 'i';
		parent = data.parent;
//		console.log('create: ', data.node, data.parent, data.position, mode);
	});
	$bus_capabilities.on("delete_node.jstree", function(e, data) {
		if (mode === 'e') { return; }
		mode = 'd';
//		console.log('delete: ', data.node, data.parent, mode);
		// DELETE
		Meteor.call('deleteNoun', data.node, data.parent, function(error, noun) {
			if(error){
				growl(error.reason);
			}else{
				if (Location.state().path === '/nouns/'+data.node.id)
					Router.go('/nouns/'+data.parent);
				growl( "Deleted "+ea.class_name.Business_Capability, {type:'s', hideSnark:true} );
			}
			refreshBusCap();
		});

	});

};

var mode, parent = null;