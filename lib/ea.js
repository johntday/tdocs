ea = {class_name:{}, modelArea:{}, modelLayer:{}, classBelongsToArea:{},
	getClassBelongsToArea: function(class_name) {
		var area = ea.classBelongsToArea[class_name];
		return area || {area:'UNKNOWN', layer:'UNKNOWN', icon: 'minus'};
	}
};
ea.class_name = {
	'Business_Objective': 'Business_Objective',
	'Business_Driver':    'Business_Driver',
	'Business_Domain':    'Business_Domain',
	'Business_Principle': 'Business_Principle',
	'Business_Capability':'Business_Capability',
	'Business_Role_Type': 'Business_Role_Type',
	'Business_Activity':  'Business_Activity',

	'Application_Architecture_Principle': 'Application_Architecture_Principle',

	External_Instance_Reference: 'External_Instance_Reference'
};
ea.accordian = {
	busLayerConcep: 'busLayerConcep',
	busLayerlogical: 'busLayerlogical'
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
ea.classBelongsToArea = {
	Business_Objective: {area:'Business', layer: 'Conceptual', icon: 'record'}
	,Business_Driver: {area:'Business', layer: 'Conceptual', icon: 'bookmark'}
	,Business_Domain: {area:'Business', layer: 'Conceptual', icon: 'home'}
	,Business_Principle: {area:'Business', layer: 'Conceptual', icon: 'thumbs-up'}
	,Business_Capability: {area:'Business', layer: 'Conceptual', icon: 'flag'}
	,Business_Role_Type: {area:'Business', layer: 'Conceptual', icon: 'user'}
	,Business_Activity: {area:'Business', layer: 'Logical', icon: 'leaf'}
	,Application_Architecture_Principle: {area: 'Application', layer: 'Conceptual', icon:'off'}
};
