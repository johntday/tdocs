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
			default: return 'UNKNOWN';
		}
	},
	getRelationships: function(source_class_name, target_class_name) {
		var rels = EA_Relationships.find( {source:source_class_name, target:target_class_name} ).fetch();

		if (source_class_name === 'Common_Group' || source_class_name === target_class_name) {
			rels.push( {source:source_class_name     ,semantic:"composed of"      ,target:target_class_name    ,rel_name:"composition"   } );
			rels.push( {source:source_class_name     ,semantic:"contains"         ,target:target_class_name    ,rel_name:"contains"      } );
		}
		rels.push( {source:source_class_name     ,semantic:"associated with"      ,target:target_class_name    ,rel_name:"association"   } );
		return rels;
	},
	getPossibleEARelsForRelationship: function(class_name) {
		if (!class_name) { return []; }
		var ea_rels = EA_Relationships.find({$or:[{source:class_name}, {target:class_name}]}).fetch();
		var class_names = {};
		_.each(ea_rels, function(ea_rel){
			class_names[ea_rel.source + ea_rel.target] = {semantic:ea_rel.semantic, rel_name:ea_rel.rel_name};
		});
		return class_names;
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
		return _.uniq(results);
	},
	nounCrossRel: function(nouns, rels){
		var results = [];
		_.each(rels, function(r){
			var source = r.source;
			var target = r.target;


		});
		return _.sortBy(results, function(item){
			return item.source_title;
		});
	},
	hasRelationship: function(source_class_name, target_class_name, both) {
		if (both && EA_Relationships.findOne( {$or:[{source:target_class_name, target:source_class_name}, {source:source_class_name, target:target_class_name}]} )) { return true; }
		if (EA_Relationships.findOne( {source:source_class_name, target:target_class_name} )) { return true; }
		return false;
	}
};
ea.classBelongsToArea = {
	// dependency on "ea_relationships.js"
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
	//,Technology_Communication_Path: {area: 'Technology', area_code: 't', layer: 'Logical', icon:'resize-horizontal', children_name: 'children'}
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
