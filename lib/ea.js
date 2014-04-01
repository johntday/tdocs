ea = {
	getClassBelongsToArea: function(class_name) {
		var area = ea.classBelongsToArea[class_name];
		return area || {area:'UNKNOWN', area_code:'u', layer:'UNKNOWN', icon: 'minus'};
	},
	getAreaName: function(area_code) {
		switch(area_code) {
			case 'a': return 'Application';
			case 'b': return 'Business';
			case 't': return 'Technology';
			case 'm': return 'Motivation';
			case 'i': return 'Implementation';
			case 'c': return 'Common';
			default: return 'Unknown';
		}
	},
	getPossibleClassNamesForRelationship: function(class_name) {
		if (!class_name) { return []; }
		var ea_rels = EA_Relationships.find({}, {fields:{source:1, target:1}}).fetch();
		var results = [];
		_.each(ea_rels, function(item){
			if (item.source===class_name)
				results.push( item.target );
			else if (item.target===class_name)
				results.push( item.source );
		});
		return results;
	},
	getRelationshipSemantic: function(source_class_name, target_class_name, rel_name) {
		return 'UNKNOWN';
	},
	hasRelationship: function(source_class_name, target_class_name, both) {
		if (both && EA_Relationships.findOne( {$or:[{source:target_class_name, target:source_class_name}, {source:source_class_name, target:target_class_name}]} )) { return true; }
		if (EA_Relationships.findOne( {source:source_class_name, target:target_class_name} )) { return true; }
		return false;
	}
};
ea.class_name = {
	Common_Group: 'Common_Group'
	,Application_Component: 'Application_Component'
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
	Common: 'Common',
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
	Application_Component: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'th-large', children_name: 'children'}
	,Application_Interface: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'unchecked', children_name: 'children'}
	,Application_Service: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'cog', children_name: 'children'}
	,Application_Function: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'chevron-up', children_name: 'children'}
	,Application_Data_Object: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'credit-card', children_name: 'children'}
	,Common_Group: {area: 'Common', area_code: 'c', layer: 'Logical', icon:'tower', children_name: 'children'}
	,Business_Actor: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'user', children_name: 'children'}
	,Business_Role: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'registration-mark', children_name: 'children'}
	,Business_Interface: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'unchecked', children_name: 'children'}
	,Business_Function: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'chevron-up', children_name: 'children'}
	,Business_Process: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'arrow-right', children_name: 'children'}
	,Business_Event: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'bell', children_name: 'children'}
	,Business_Service: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'cog', children_name: 'children'}
	,Business_Object: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'credit-card', children_name: 'children'}
	,Business_Location: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'map-marker', children_name: 'children'}
	,Technology_Artifact: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'file', children_name: 'children'}
	,Technology_Communication_Path: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'resize-horizontal', children_name: 'children'}
	,Technology_Network: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'cloud', children_name: 'children'}
	,Technology_Interface: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'unchecked', children_name: 'children'}
	,Technology_Function: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'chevron-up', children_name: 'children'}
	,Technology_Service: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'cog', children_name: 'children'}
	,Technology_Node: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'stop', children_name: 'children'}
	,Technology_Software: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'th', children_name: 'children'}
	,Technology_Device: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'tasks', children_name: 'children'}
	,Motivation_Stakeholder: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'flag', children_name: 'children'}
	,Motivation_Driver: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'leaf', children_name: 'children'}
	//,Motivation_Assessment: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'flash', children_name: 'children'}
	,Motivation_Goal: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'record', children_name: 'children'}
	,Motivation_Principle: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'screenshot', children_name: 'children'}
	,Motivation_Requirement: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'bullhorn', children_name: 'children'}
	,Motivation_Constraint: {area: 'Motivation', area_code: 'm', layer: 'Logical', icon:'link', children_name: 'children'}
	,Implementation_Work_Package: {area: 'Implementation', area_code: 'i', layer: 'Logical', icon:'book', children_name: 'children'}
	,Implementation_Deliverable: {area: 'Implementation', area_code: 'i', layer: 'Logical', icon:'list-alt', children_name: 'children'}
	,Implementation_Plateau: {area: 'Implementation', area_code: 'i', layer: 'Logical', icon:'road', children_name: 'children'}
	,Implementation_Gap: {area: 'Implementation', area_code: 'i', layer: 'Logical', icon:'resize-full', children_name: 'children'}
};
//if (!ea.relationships_index){
//	ea.relationships_index = {};
//	_.each(ea.relationships, function(rel){
//		ea.relationships_index[rel.source+rel.target+rel.rel_name] = {semantic:rel.semantic};
//		ea.relationships_index[rel.target+rel.source+rel.rel_name] = {semantic:rel.r_semantic};
//	});
//}
