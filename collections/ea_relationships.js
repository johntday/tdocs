/*------------------------------------------------------------------------------------------------------------------------------*/
EA_Relationships.allow({
	insert: function (userId, doc) {
		return false;
	},
	update: function (userId, doc, fields, modifier) {
		return false;
	},
	remove: function (userId, doc) {
		return false;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/

Meteor.methods({
	resetEA_Relationships: function() {
		var user = Meteor.user();
		if (!user || !isAdmin(user))
			throw new Meteor.Error(601, 'You need be an Administrator to perform this function');

		// NOTIFICATION
//		if (isAdmin()) {
//			var m = Nouns.findOne(nounId);
//			var n = notificationFactory(MOVIE_DELETED_BY_ADMIN, "noun", m.userId, m.title, m.status, "/nouns/"+nounId, getNow());
//			Notifications.insert(n);
//		}

		EA_Relationships.remove({});

		var relationships = [
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
			,{source:"Business_Object"           ,semantic: "specialization of"    ,r_semantic:     "generalized by"     ,target:"Business_Object"            ,rel_name:"specialization",arrow:"-->>"    ,bidirectional:false}
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
			,{source:"Application_Data_Object"   ,semantic: "specialization of"    ,r_semantic:     "generalized by"     ,target:"Application_Data_Object"    ,rel_name:"specialization",arrow:"-->>"    ,bidirectional:false}
			,{source:"Application_Data_Object"   ,semantic:      "contains"        ,r_semantic:    "is contained by"     ,target:"Application_Data_Object"    ,rel_name:"contains"     ,arrow:"<>--"    ,bidirectional:false}
			,{source:"Application_Function"      ,semantic:       "CRUDs"          ,r_semantic:        "CRUD by"         ,target:"Application_Data_Object"    ,rel_name:"access"       ,arrow:"-crud->" ,bidirectional:false}
		];
		var inserted = 0;
		for (var i=0; i < relationships.length; i++) {
			EA_Relationships.insert(relationships[i]);
			inserted++;
		}

		var found = EA_Relationships.find().count();

		console.log('Finished loading: EA_Relationships cnt='+inserted);

		return [inserted, found];
	}

});
