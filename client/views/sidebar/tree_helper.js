refreshBusCap = function(class_name) {
//	if (!getProjectId()) return false;
	try {
		if (sidebar.Business_Capability) { sidebar.Business_Capability.destroy(); sidebar.Business_Capability=null; }
	} catch(err) {}
	var root = Nouns.findOne({class_name: ea.class_name.Business_Capability, business_capability_level:"-1"});
//	if (!root && retryCnt++ < 3) {
//			// TRY AGAIN
//			Meteor.setTimeout(function(){
//				refreshBusCap(class_name);
//				1000});
//	}
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

	var $bus_capabilities = $('#'+class_name);
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
	sidebar.Business_Capability = $bus_capabilities.jstree(true);

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
					sidebar.Business_Capability.delete_node(data.node);
					growl(error.reason);
				}else{
					refreshBusCap(properties.class_name);
//					Router.go('/nouns/'+noun.nounId);
					growl( "Created "+properties.class_name, {type:'s', hideSnark:true} );
				}
			});

			mode = null;
		} else if (data.text !== data.old) {
			mode === 'u';
//			console.log('rename: ', data.node, data.text, data.old, mode);
			// UPDATE TITLE
			Meteor.call('updateNounTitle', data.node.id, data.text, function(error, noun) {
				if(error){
					growl(error.reason);
				}else{
					refreshBusCap(data.node.original.class_name);
					growl( "Update "+ea.class_name.Business_Capability, {type:'s', hideSnark:true} );
				}
			});
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
			refreshBusCap(data.node.original.class_name);
		});
	});
	$bus_capabilities.on("move_node.jstree", function(e, data) {
		//console.log(data.node, data.parent, data.node.original.instance_name, data.node.original.class_name, data.position);
		Meteor.call('moveNoun', data.old_parent, data.parent, data.node.original.instance_name, data.node.original.class_name, data.position, function(error, noun) {
			if(error){
				growl(error.reason);
			}else{
			}
			refreshBusCap(data.node.original.class_name);
		});
	});
	//
	return true;
};

var mode, parent = null;
var retryCnt=0;