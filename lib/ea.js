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
			default: return 'Unknown';
		}
	},
	getPossibleClassNamesForRelationship: function(class_name) {
		if (!class_name) { return []; }
		var results = [];
		_.each(ea.relationships, function(item){
			if (item.source===class_name)
				results.push( item.target );
			else if (item.target===class_name)
				results.push( item.source );
		});
		return results;
	},
	getRelationshipSemantic: function(source_class_name, target_class_name) {
		var rel = ea.relationships_index[source_class_name+target_class_name];
		if (rel){ return {semantic: rel.semantic, rel_name: rel.rel_name}; }
//		var rel = _.findWhere(ea.relationships, {source:source_class_name, target:target_class_name});
//		if (rel)
//			return {semantic: rel.semantic, rel_name: rel.rel_name};
//		rel = _.findWhere(ea.relationships, {source:target_class_name, target:source_class_name});
//		if (rel)
//			return {semantic: rel.r_semantic, rel_name: rel.rel_name};
		return {semantic: 'UNKNOWN', rel_name: 'UNKNOWN'};
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
	Application_Component: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'th-large', children_name: 'children'}
	,Application_Interface: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'unchecked', children_name: 'children'}
	,Application_Service: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'cog', children_name: 'children'}
	,Application_Function: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'chevron-up', children_name: 'children'}
	,Application_Data_Object: {area: 'Application', area_code: 'a', layer: 'Logical', icon:'credit-card', children_name: 'children'}
	,Business_Domain: {area: 'Business', area_code: 'b', layer: 'Logical', icon:'tower', children_name: 'children'}
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
ea.relationships = [
{source:"Business_Role"             ,semantic:        "uses"          ,r_semantic:       "is used by"       ,target:"Business_Service"           ,rel_name:"uses"         ,arrow:"-uses->" ,bidirectional:false}
,{source:"Business_Service"          ,semantic:        "uses"          ,r_semantic:       "is used by"       ,target:"Business_Service"           ,rel_name:"uses"         ,arrow:"-uses->" ,bidirectional:false}
,{source:"Business_Service"          ,semantic:      "contains"        ,r_semantic:    "is contained by"     ,target:"Business_Service"           ,rel_name:"contains"     ,arrow:"<>--"    ,bidirectional:false}
,{source:"Business_Function"         ,semantic:   "realization of"     ,r_semantic:      "realized by"       ,target:"Business_Service"           ,rel_name:"realization"  ,arrow:"- ->>"   ,bidirectional:false}
,{source:"Business_Process"          ,semantic:   "realization of"     ,r_semantic:      "realized by"       ,target:"Business_Service"           ,rel_name:"realization"  ,arrow:"- ->>"   ,bidirectional:false}
,{source:"Business_Service"          ,semantic:       "CRUDs"          ,r_semantic:        "CRUD by"         ,target:"Business_Object"            ,rel_name:"access"       ,arrow:"-crud->" ,bidirectional:false}
,{source:"Business_Process"          ,semantic:      "flows to"        ,r_semantic:       "flows from"       ,target:"Business_Process"           ,rel_name:"flow"         ,arrow:"- ->"    ,bidirectional:false}
,{source:"Business_Function"         ,semantic:      "contains"        ,r_semantic:    "is contained by"     ,target:"Business_Process"           ,rel_name:"contains"     ,arrow:"<>--"    ,bidirectional:false}
,{source:"Business_Role"             ,semantic:      "assigned"        ,r_semantic:        "assigned"        ,target:"Business_Process"           ,rel_name:"assigns"      ,arrow:"*--*"    ,bidirectional:true}
,{source:"Business_Process"          ,semantic:        "uses"          ,r_semantic:       "is used by"       ,target:"Application_Service"        ,rel_name:"uses"         ,arrow:"-uses->" ,bidirectional:false}
,{source:"Business_Event"            ,semantic:      "triggers"        ,r_semantic:      "triggered by"      ,target:"Business_Process"           ,rel_name:"trigger"      ,arrow:"-t->"    ,bidirectional:false}
,{source:"Business_Process"          ,semantic:       "CRUDs"          ,r_semantic:        "CRUD by"         ,target:"Business_Object"            ,rel_name:"access"       ,arrow:"-crud->" ,bidirectional:false}
,{source:"Business_Role"             ,semantic:      "assigned"        ,r_semantic:        "assigned"        ,target:"Business_Actor"             ,rel_name:"assigns"      ,arrow:"*--*"    ,bidirectional:true}
,{source:"Business_Event"            ,semantic:      "assigned"        ,r_semantic:        "assigned"        ,target:"Business_Role"              ,rel_name:"assigns"      ,arrow:"*--*"    ,bidirectional:true}
,{source:"Business_Function"         ,semantic:      "assigned"        ,r_semantic:        "assigned"        ,target:"Business_Role"              ,rel_name:"assigns"      ,arrow:"*--*"    ,bidirectional:true}
,{source:"Business_Role"             ,semantic:        "uses"          ,r_semantic:       "is used by"       ,target:"Business_Interface"         ,rel_name:"uses"         ,arrow:"-uses->" ,bidirectional:false}
,{source:"Business_Function"         ,semantic:       "CRUDs"          ,r_semantic:        "CRUD by"         ,target:"Business_Object"            ,rel_name:"access"       ,arrow:"-crud->" ,bidirectional:false}
,{source:"Implementation_Deliverable",semantic:   "realization of"     ,r_semantic:      "realized by"       ,target:"Business_Object"            ,rel_name:"realization"  ,arrow:"- ->>"   ,bidirectional:false}
,{source:"Business_Object"           ,semantic:      "contains"        ,r_semantic:    "is contained by"     ,target:"Business_Object"            ,rel_name:"contains"     ,arrow:"<>--"    ,bidirectional:false}
,{source:"Business_Object"           ,semantic:    "composed of"       ,r_semantic:      "composed by"       ,target:"Business_Object"            ,rel_name:"composition"  ,arrow:"<<>--"   ,bidirectional:false}
,{source:"Business_Object"           ,semantic: "specialization of"    ,r_semantic:     "generalized by"     ,target:"Business_Object"            ,rel_name:"specialization",arrow:"-->>"   ,bidirectional:false}
,{source:"Business_Product"          ,semantic:     "has value"        ,r_semantic:     "associated to"      ,target:"Business_Value"             ,rel_name:"association"  ,arrow:"---"     ,bidirectional:true}
,{source:"Business_Product"          ,semantic:      "contains"        ,r_semantic:    "is contained by"     ,target:"Business_Contract"          ,rel_name:"contains"     ,arrow:"<>--"    ,bidirectional:false}
,{source:"Business_Product"          ,semantic:      "contains"        ,r_semantic:    "is contained by"     ,target:"Business_Service"           ,rel_name:"contains"     ,arrow:"<>--"    ,bidirectional:false}
,{source:"Application_Collaboration" ,semantic:      "contains"        ,r_semantic:    "is contained by"     ,target:"Application_Component"      ,rel_name:"contains"     ,arrow:"<>--"    ,bidirectional:false}
,{source:"Application_Component"     ,semantic:    "composed of"       ,r_semantic:      "composed by"       ,target:"Application_Component"      ,rel_name:"composition"  ,arrow:"<<>--"   ,bidirectional:false}
,{source:"Application_Component"     ,semantic:    "composed of"       ,r_semantic:      "composed by"       ,target:"Application_Interface"      ,rel_name:"composition"  ,arrow:"<<>--"   ,bidirectional:false}
,{source:"Technology_Service"        ,semantic:        "uses"          ,r_semantic:       "is used by"       ,target:"Application_Component"      ,rel_name:"uses"         ,arrow:"-uses->" ,bidirectional:false}
,{source:"Application_Function"      ,semantic:      "assigned"        ,r_semantic:        "assigned"        ,target:"Application_Component"      ,rel_name:"assigns"      ,arrow:"*--*"    ,bidirectional:true}
,{source:"Application_Component"     ,semantic:       "CRUDs"          ,r_semantic:        "CRUD by"         ,target:"Application_Data_Object"    ,rel_name:"access"       ,arrow:"-crud->" ,bidirectional:false}
,{source:"Application_Component"     ,semantic:    "send data to"      ,r_semantic:     "gets data from"     ,target:"Application_Component"      ,rel_name:"flow"         ,arrow:"- ->"    ,bidirectional:false}
,{source:"Application_Component"     ,semantic:   "realization of"     ,r_semantic:      "realized by"       ,target:"Application_Service"        ,rel_name:"realization"  ,arrow:"- ->>"   ,bidirectional:false}
,{source:"Application_Service"       ,semantic:        "uses"          ,r_semantic:       "is used by"       ,target:"Application_Service"        ,rel_name:"uses"         ,arrow:"-uses->" ,bidirectional:false}
,{source:"Application_Service"       ,semantic:      "contains"        ,r_semantic:    "is contained by"     ,target:"Application_Service"        ,rel_name:"contains"     ,arrow:"<>--"    ,bidirectional:false}
,{source:"Application_Service"       ,semantic:        "uses"          ,r_semantic:       "is used by"       ,target:"Application_Component"      ,rel_name:"uses"         ,arrow:"-uses->" ,bidirectional:false}
,{source:"Application_Function"      ,semantic:   "realization of"     ,r_semantic:      "realized by"       ,target:"Application_Service"        ,rel_name:"realization"  ,arrow:"- ->>"   ,bidirectional:false}
,{source:"Application_Service"       ,semantic:       "CRUDs"          ,r_semantic:        "CRUD by"         ,target:"Application_Data_Object"    ,rel_name:"access"       ,arrow:"-crud->" ,bidirectional:false}
,{source:"Technology_Artifact"       ,semantic:   "realization of"     ,r_semantic:      "realized by"       ,target:"Application_Data_Object"    ,rel_name:"realization"  ,arrow:"- ->>"   ,bidirectional:false}
,{source:"Application_Data_Object"   ,semantic:    "composed of"       ,r_semantic:      "composed by"       ,target:"Application_Data_Object"    ,rel_name:"composition"  ,arrow:"<<>--"   ,bidirectional:false}
,{source:"Application_Data_Object"   ,semantic: "specialization of"    ,r_semantic:     "generalized by"     ,target:"Application_Data_Object"    ,rel_name:"specialization",arrow:"-->>"   ,bidirectional:false}
,{source:"Application_Data_Object"   ,semantic:      "contains"        ,r_semantic:    "is contained by"     ,target:"Application_Data_Object"    ,rel_name:"contains"     ,arrow:"<>--"    ,bidirectional:false}
,{source:"Application_Function"      ,semantic:       "CRUDs"          ,r_semantic:        "CRUD by"         ,target:"Application_Data_Object"    ,rel_name:"access"       ,arrow:"-crud->" ,bidirectional:false}
,{source:"Motivation_Stakeholder"    ,semantic:       "gives data to"  ,r_semantic:        "gets data from"  ,target:"Motivation_Stakeholder"     ,rel_name:"flow"         ,arrow:"- ->"    ,bidirectional:false}

];
if (!ea.relationships_index){
	ea.relationships_index = {};
	_.each(ea.relationships, function(rel){
		ea.relationships_index[rel.source+rel.target] = {semantic:rel.semantic, rel_name:rel.rel_name};
		ea.relationships_index[rel.target+rel.source] = {semantic:rel.r_semantic, rel_name:rel.rel_name};
	});
}
