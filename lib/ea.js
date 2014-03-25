ea = {class_name:{}, modelArea:{}, modelLayer:{}, classBelongsToArea:{},
	getClassBelongsToArea: function(class_name) {
		var area = ea.classBelongsToArea[class_name];
		return area || {area:'UNKNOWN', area_code:'u', layer:'UNKNOWN', icon: 'minus'};
	},
	getRelationship: function(source_class_name, target_class_name) {
		return ea.relationships[source_class_name + target_class_name];
	},
	getAreaName: function(area_code) {
		switch(area_code) {
			case 'a': return 'Application';
			case 'b': return 'Business';
			case 't': return 'Technology';
			case 'm': return 'Motivation';
			case 'i': return 'Implementation';
			default: return 'Unknown';
		}
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
	Application_Component: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Application_Interface: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Application_Service: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'cog', children_name: 'children'}
	,Application_Function: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'chevron-up', children_name: 'children'}
	,Application_Data_Object: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Domain: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Actor: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'user', children_name: 'children'}
	,Business_Role: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Interface: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Function: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'chevron-up', children_name: 'children'}
	,Business_Process: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Event: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'bell', children_name: 'children'}
	,Business_Service: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'cog', children_name: 'children'}
	,Business_Object: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Business_Location: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'map-marker', children_name: 'children'}
	,Technology_Artifact: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Communication_Path: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Network: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Interface: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Function: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'chevron-up', children_name: 'children'}
	,Technology_Service: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'cog', children_name: 'children'}
	,Technology_Node: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'stop', children_name: 'children'}
	,Technology_Software: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Technology_Device: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Motivation_Stakeholder: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Motivation_Driver: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'flash', children_name: 'children'}
	//,Motivation_Assessment: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Motivation_Goal: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'record', children_name: 'children'}
	,Motivation_Principle: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Motivation_Requirement: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Motivation_Constraint: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Implementation_Work_Package: {area: 'Implementation', area_code: 'i', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Implementation_Deliverable: {area: 'Implementation', area_code: 'i', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Implementation_Plateau: {area: 'Implementation', area_code: 'i', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Implementation_Gap: {area: 'Implementation', area_code: 'i', layer: 'Logical', icon:'flash', children_name: 'children'}
};
ea.relationships = {
	Business_Location_Business_Actor: {rel_type: 'assignment', arrow_type: '', points_to: '', semantic: 'assigned to'}
	,Business_Actor_Business_Role: {rel_type: 'assignment', arrow_type: '', points_to: '', semantic: 'assigned to'}
	,Business_Interface_Business_Actor: {rel_type: 'used_by', arrow_type: '', points_to: '', semantic: 'used by'}
	,Business_Service_Business_Actor: {rel_type: 'used_by', arrow_type: '', points_to: '', semantic: 'used by'}
};