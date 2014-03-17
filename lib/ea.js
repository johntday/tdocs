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
	'Application_Function':  'Application_Function',
	'Application_Provider_Role':  'Application_Provider_Role',

	'Application_Architecture_Principle': 'Application_Architecture_Principle',
	'Application_Capability':             'Application_Capability',
	'Application_Function_Implementation': 'Application_Function_Implementation',

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
	Business_Objective: {area:'Business', layer: 'Conceptual', icon: 'record', children_name: 'children'}
	,Business_Driver: {area:'Business', layer: 'Conceptual', icon: 'bookmark', children_name: 'children'}
	,Business_Domain: {area:'Business', layer: 'Conceptual', icon: 'home', children_name: 'contained_business_domains'}
	,Business_Principle: {area:'Business', layer: 'Conceptual', icon: 'thumbs-up', children_name: 'children'}
	,Business_Capability: {area:'Business', layer: 'Conceptual', icon: 'flag', children_name: 'contained_business_capabilities'}
	,Business_Role_Type: {area:'Business', layer: 'Conceptual', icon: 'user', children_name: 'children'}
	,Business_Activity: {area:'Business', layer: 'Logical', icon: 'leaf', children_name: 'children'}
	,Application_Architecture_Principle: {area: 'Application', layer: 'Conceptual', icon:'off', children_name: 'children'}
	,Application_Capability: {area: 'Application', layer: 'Conceptual', icon:'flag', children_name: 'contained_app_capabilities'}
	,Application_Function: {area: 'Application', layer: 'Logical', icon:'chevron-up', children_name: 'children'}
	,Application_Provider_Role: {area: 'Application', layer: 'Logical', icon:'user', children_name: 'children'}
	,Application_Function_Implementation: {area: 'Application', layer: 'Logical', icon:'flash', children_name: 'children'}
};
