ea = {class_name:{}, modelArea:{}, modelLayer:{}, classBelongsToArea:{},
	getClassBelongsToArea: function(area) {
		var area = ea.classBelongsToArea[area];
		return area || 'UNKNOWN';
	}
};
ea.class_name = {
	'Business_Objective': 'Business_Objective',
	'Business_Driver':    'Business_Driver',
	'Business_Domain':    'Business_Domain',
	'Business_Principle': 'Business_Principle',
	'Business_Capability':'Business_Capability',
	'Business_Role_Type': 'Business_Role_Type',

	//ARCHI
	Business_Actor: 'Business_Actor',

	External_Instance_Reference: 'External_Instance_Reference'
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
ea.classBelongsToArea = _.object(
	[
		[ea.class_name.Business_Capability, ea.modelArea.Business]
	    ,[ea.class_name.Business_Actor, ea.modelArea.Business]
	]
);
