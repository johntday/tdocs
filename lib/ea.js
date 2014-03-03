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

toNode = function(noun) {
	return {id: noun._id, label: noun.title, parent_id: noun.parent_id};
};
toNodeArray = function(collection, rootLabel) {
	var nodeArray = [];
	var list = collection.map(function(noun){
		return {id: noun._id, label: noun.title, parent_id: noun.parent_id};
	});

	var groupByIndex = _.groupBy(list, 'parent_id');
	var level1 = groupByIndex[''];

	nodeArray.push({
		label: rootLabel,
		children: groupByIndex['']
	});

	return nodeArray;
};
