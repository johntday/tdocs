ea = {class_name:{}, modelArea:{}, modelLayer:{}, classBelongsToArea:{}, accordian:{},
	getClassBelongsToArea: function(area) {
		var area = ea.classBelongsToArea[area];
		return area || 'UNKNOWN';
	},
	getClassBelongsToLayer: function(layer) {
		var area = ea.classBelongsToLayer[layer];
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
	'Business_Activity':  'Business_Activity',

	//ARCHI
	Business_Actor: 'Business_Actor',

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
ea.classBelongsToArea = _.object(
	[
		[ea.class_name.Business_Capability, ea.modelArea.Business]
		,[ea.class_name.Business_Objective, ea.modelArea.Business]
		,[ea.class_name.Business_Driver, ea.modelArea.Business]
		,[ea.class_name.Business_Domain, ea.modelArea.Business]
		,[ea.class_name.Business_Principle, ea.modelArea.Business]
		,[ea.class_name.Business_Role_Type, ea.modelArea.Business]
		,[ea.class_name.Business_Activity, ea.modelArea.Business]
	]
);
ea.classBelongsToLayer = _.object(
	[
		[ea.class_name.Business_Capability, ea.modelLayer.Conceptual]
		,[ea.class_name.Business_Objective, ea.modelLayer.Conceptual]
		,[ea.class_name.Business_Driver, ea.modelLayer.Conceptual]
		,[ea.class_name.Business_Domain, ea.modelLayer.Conceptual]
		,[ea.class_name.Business_Principle, ea.modelLayer.Conceptual]
		,[ea.class_name.Business_Role_Type, ea.modelLayer.Conceptual]
		,[ea.class_name.Business_Activity, ea.modelLayer.Logical]
	]
);
