ea = {class_name:{}, modelArea:{}, modelLayer:{}, classBelongsToArea:{},
	getClassBelongsToArea: function(class_name) {
		var area = ea.classBelongsToArea[class_name];
		return area || {area:'UNKNOWN', layer:'UNKNOWN', icon: 'minus'};
	},
	getRelationship: function(source_class_name, target_class_name) {
		return ea.relationships[source_class_name + target_class_name];
	}
};
ea.class_name = {
	Application_Component: 'Application_Component'
	,Application_Interface: 'Application_Interface'
	,Application_Service: 'Application_Service'
	,Application_Function: 'Application_Function'
	,Application_Data_Object: 'Application_Data_Object'
	,Business_Domain: 'Business_Actor'
	,Business_Actor: 'Business_Actor'
	,Business_Role: 'Business_Role'
	,Business_Interface: 'Business_Interface'
	,Business_Function: 'Business_Function'
	,Business_Process: 'Business_Process'
	,Business_Event: 'Business_Event'
	,Business_Service: 'Business_Service'
	,Business_Object: 'Business_Object'
	,Business_Location: 'Business_Location'
	,Technology_Artifact: 'Technology_Artifact'
	,Technology_Communication_Path: 'Technology_Artifact'
	,Technology_Network: 'Technology_Network'
	,Technology_Interface: 'Technology_Interface'
	,Technology_Function: 'Technology_Function'
	,Technology_Service: 'Technology_Service'
	,Technology_Node: 'Technology_Node'
	,Technology_Software: 'Technology_Software'
	,Technology_Device: 'Technology_Device'
};
ea.modelArea = {
	Business: 'Business',
	Application: 'Application',
	Technology: 'Technology',
	Motivation: 'Motivation',
	Implementation: 'Implementation'
};
ea.modelLayer = {
	Conceptual: 'Conceptual',
	Logical: 'Logical',
	Physical: 'Physical'
};
ea.classBelongsToArea = {
	Application_Component: {area: 'Application', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Application_Interface: {area: 'Application', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Application_Service: {area: 'Application', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Application_Function: {area: 'Application', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Application_Data_Object: {area: 'Application', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Domain: {area: 'Business', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Actor: {area: 'Business', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Role: {area: 'Business', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Interface: {area: 'Business', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Function: {area: 'Business', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Process: {area: 'Business', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Event: {area: 'Business', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Service: {area: 'Business', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Object: {area: 'Business', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Location: {area: 'Business', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Artifact: {area: 'Technology', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Communication_Path: {area: 'Technology', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Network: {area: 'Technology', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Interface: {area: 'Technology', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Function: {area: 'Technology', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Service: {area: 'Technology', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Node: {area: 'Technology', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Software: {area: 'Technology', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Device: {area: 'Technology', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Motivation_Stakeholder: {area: 'Motivation', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Motivation_Driver: {area: 'Motivation', layer: 'Logical', icon:'flash', children_name: 'children'}
	//,Motivation_Assessment: {area: 'Motivation', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Motivation_Goal: {area: 'Motivation', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Motivation_Principle: {area: 'Motivation', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Motivation_Requirement: {area: 'Motivation', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Motivation_Constraint: {area: 'Motivation', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Implementation_Work_Package: {area: 'Implementation', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Implementation_Deliverable: {area: 'Implementation', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Implementation_Plateau: {area: 'Implementation', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Implementation_Gap: {area: 'Implementation', layer: 'Logical', icon:'flash', children_name: 'children'}
};
ea.relationships = {
	Business_Location_Business_Actor: {rel_type: 'assignment', arrow_type: '', points_to: '', semantic: 'assigned to'}
	,Business_Actor_Business_Role: {rel_type: 'assignment', arrow_type: '', points_to: '', semantic: 'assigned to'}
	,Business_Interface_Business_Actor: {rel_type: 'used_by', arrow_type: '', points_to: '', semantic: 'used by'}
	,Business_Service_Business_Actor: {rel_type: 'used_by', arrow_type: '', points_to: '', semantic: 'used by'}
};