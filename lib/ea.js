ea = {eaType:{}, modelArea:{}, modelLayer:{}};
ea.eaType = {
	'Business_Objective': 'Business_Objective',
	'Business_Driver':    'Business_Driver',
	'Business_Domain':    'Business_Domain',
	'Business_Principle': 'Business_Principle',
	'Business_Capability':'Business_Capability',
	'Business_Role_Type': 'Business_Role_Type'
};
ea.modelArea = {
	Business: 'Business',
	Information: 'Information',
	Application: 'Application',
	Technology: 'Technology'
};
ea.modelLayer = {
	Conceptual: 'Conceptual',
	Logical: 'Logical',
	Physical: 'Physical'
};

toNodeArray = function(collection, rootLabel) {
	var nodeArray = [];
	var index = _.indexBy(collection, 'instance_name');

	collection.forEach(function(noun){
		if (noun.contained_business_capabilities) {
			noun.contained_business_capabilities.forEach(function(child_instance_name){
				var children = [];
				if (_.has(index, child_instance_name)){
					children.push( index[child_instance_name] );
					_.extend(noun, {children: children});
				} else {
					console.log('Cannot find Noun for "'+child_instance_name+'"');
				}
			});
		}
		_.extend(noun, {id: noun._id, label: noun.title});
	});


	var level0 = _.where(collection, {business_capability_level:"0"});
	nodeArray.push({
		label: rootLabel,
		children: childrenRecursive(index, level0)
	});

	return nodeArray;
};

function mapTo(noun){
	return {id: noun._id, label: noun.title, children: noun.children, contained_business_capabilities: noun.contained_business_capabilities};
}
function childrenRecursive(index, list) {
	var children = [];
	list.forEach(function(noun){
		if (noun.contained_business_capabilities) {
			noun.contained_business_capabilities.forEach(function(child_instance_name){
				if (_.has(index, child_instance_name)){
					children.push( index[child_instance_name] );
				}
			});
			_.extend(noun, {children: children});
		}
	});
	return children;
}
function jqTreeData(data) {
	var source = [];
	var items = [];
	// build hierarchical source.
	for (i = 0; i < data.length; i++) {
		var item = data[i];
		var title = item["Title"];
		var reportsToId = item["ReportsToId"];
		var id = item["Id"];

		if (items[reportsToId]) {
			var item =
			{
				label: title
			};

			if (!items[reportsToId].children) {
				items[reportsToId].children = [];
			}

			items[reportsToId].children[items[reportsToId].children.length] = item;
			items[id] = item;
		}
		else {
			items[id] =
			{
				label: title
			};

			source[0] = items[id];
		}
	}
	return source;
}
