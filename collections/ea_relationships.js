/* source
    semantic
    r_semantic
    target
    rel_name
	bidirectional
 */
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
	resetEA_Nouns: function() {
		var user = Meteor.user();
		if (!user || !isAdmin(user))
			throw new Meteor.Error(601, 'You need be an Administrator to perform this function');

		// NOTIFICATION
		//		if (isAdmin()) {
		//			var m = Nouns.findOne(nounId);
		//			var n = notificationFactory(MOVIE_DELETED_BY_ADMIN, "noun", m.userId, m.title, m.status, "/nouns/"+nounId, getNow());
		//			Notifications.insert(n);
		//		}

		EA_Nouns.remove({});

		var ea_nouns = [
			 {Application_Component        :{}}
			,{Application_Interface        :{}}
			,{Application_Service          :{}}
			,{Application_Function         :{}}
			,{Application_Data_Object      :{}}
			,{Common_Group                 :{}}
			,{Business_Actor               :{}}
			,{Business_Role                :{}}
			,{Business_Interface           :{}}
			,{Business_Function            :{}}
			,{Business_Process             :{}}
			,{Business_Event               :{}}
			,{Business_Service             :{}}
			,{Business_Object              :{}}
			,{Business_Location            :{}}
			,{Technology_Artifact          :{}}
			,{Technology_Communication_Path:{}}
			,{Technology_Network           :{}}
			,{Technology_Interface         :{}}
			,{Technology_Function          :{}}
			,{Technology_Service           :{}}
			,{Technology_Node              :{}}
			,{Technology_Software          :{}}
			,{Technology_Device            :{}}
			,{Motivation_Stakeholder       :{}}
			,{Motivation_Driver            :{}}
		//  ,{Motivation_Assessment        :{}}
			,{Motivation_Goal              :{}}
			,{Motivation_Principle         :{}}
			,{Motivation_Requirement       :{}}
			,{Motivation_Constraint        :{}}
			,{Implementation_Work_Package  :{}}
			,{Implementation_Deliverable   :{}}
			,{Implementation_Plateau       :{}}
			,{Implementation_Gap           :{}}
		];

		var inserted = 0;
		var nouns = _.values(ea_nouns);
		for (var i=0; i < nouns.length; i++) {
			var noun = nouns[i];
			noun.created = getNow();
			EA_Nouns.insert(noun);
			inserted++;
		}

		var found = EA_Nouns.find().count();

		console.log('FINISHED RELOADING EA_NOUNS');
		console.log('Num of base nouns: '+nouns.length);
		console.log('Num of loaded EA_Nouns: '+inserted);
		console.log('Num of loaded EA_Nouns found: '+found);

		return [inserted, found];
	},
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
	 {source:"Business_Actor"            ,semantic:"sends data to"    ,r_semantic:"receives data"  ,target:"Business_Actor"         ,rel_name:"flow"          }
	,{source:"Business_Role"             ,semantic:"sends data to"    ,r_semantic:"receives data"  ,target:"Business_Role"          ,rel_name:"flow"          }
	,{source:"Business_Role"             ,semantic:"uses"             ,r_semantic:"is used by"     ,target:"Business_Service"       ,rel_name:"uses"          }
	,{source:"Business_Service"          ,semantic:"uses"             ,r_semantic:"is used by"     ,target:"Business_Service"       ,rel_name:"uses"          }
	,{source:"Business_Service"          ,semantic:"contains"         ,r_semantic:"is contained by",target:"Business_Service"       ,rel_name:"contains"      }
	,{source:"Business_Function"         ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Business_Service"       ,rel_name:"realization"   }
	,{source:"Business_Process"          ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Business_Service"       ,rel_name:"realization"   }
	,{source:"Business_Service"          ,semantic:"CRUDs"            ,r_semantic:"CRUD by"        ,target:"Business_Object"        ,rel_name:"access"        }
	,{source:"Business_Process"          ,semantic:"flows to"         ,r_semantic:"flows from"     ,target:"Business_Process"       ,rel_name:"flow"          }
	,{source:"Business_Function"         ,semantic:"contains"         ,r_semantic:"is contained by",target:"Business_Process"       ,rel_name:"contains"      }
	,{source:"Business_Role"             ,semantic:"assigned"         ,r_semantic:"assigned"       ,target:"Business_Process"       ,rel_name:"assigns"       }
	,{source:"Business_Process"          ,semantic:"uses"             ,r_semantic:"is used by"     ,target:"Application_Service"    ,rel_name:"uses"          }
	,{source:"Business_Event"            ,semantic:"triggers"         ,r_semantic:"triggered by"   ,target:"Business_Process"       ,rel_name:"trigger"       }
	,{source:"Business_Process"          ,semantic:"CRUDs"            ,r_semantic:"CRUD by"        ,target:"Business_Object"        ,rel_name:"access"        }
	,{source:"Business_Process"          ,semantic:"contains"         ,r_semantic:"is contained by",target:"Business_Process"       ,rel_name:"contains"      }
	,{source:"Business_Role"             ,semantic:"assigned"         ,r_semantic:"assigned"       ,target:"Business_Actor"         ,rel_name:"assigns"       }
	,{source:"Business_Event"            ,semantic:"assigned"         ,r_semantic:"assigned"       ,target:"Business_Role"          ,rel_name:"assigns"       }
	,{source:"Business_Function"         ,semantic:"assigned"         ,r_semantic:"assigned"       ,target:"Business_Role"          ,rel_name:"assigns"       }
	,{source:"Business_Role"             ,semantic:"uses"             ,r_semantic:"is used by"     ,target:"Business_Interface"     ,rel_name:"uses"          }
	,{source:"Business_Function"         ,semantic:"CRUDs"            ,r_semantic:"CRUD by"        ,target:"Business_Object"        ,rel_name:"access"        }
	,{source:"Implementation_Deliverable",semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Business_Object"        ,rel_name:"realization"   }
	,{source:"Business_Object"           ,semantic:"contains"         ,r_semantic:"is contained by",target:"Business_Object"        ,rel_name:"contains"      }
	,{source:"Business_Object"           ,semantic:"composed of"      ,r_semantic:"composed by"    ,target:"Business_Object"        ,rel_name:"composition"   }
	,{source:"Business_Object"           ,semantic:"specialization of",r_semantic:"generalized by" ,target:"Business_Object"        ,rel_name:"specialization"}
	,{source:"Business_Product"          ,semantic:"has value"        ,r_semantic:"associated to"  ,target:"Business_Value"         ,rel_name:"association"   }
	,{source:"Business_Product"          ,semantic:"contains"         ,r_semantic:"is contained by",target:"Business_Contract"      ,rel_name:"contains"      }
	,{source:"Business_Product"          ,semantic:"contains"         ,r_semantic:"is contained by",target:"Business_Service"       ,rel_name:"contains"      }
	,{source:"Application_Collaboration" ,semantic:"contains"         ,r_semantic:"is contained by",target:"Application_Component"  ,rel_name:"contains"      }
	,{source:"Application_Component"     ,semantic:"composed of"      ,r_semantic:"composed by"    ,target:"Application_Component"  ,rel_name:"composition"   }
	,{source:"Application_Component"     ,semantic:"composed of"      ,r_semantic:"composed by"    ,target:"Application_Interface"  ,rel_name:"composition"   }
	,{source:"Technology_Service"        ,semantic:"uses"             ,r_semantic:"is used by"     ,target:"Application_Component"  ,rel_name:"uses"          }
	,{source:"Application_Function"      ,semantic:"assigned"         ,r_semantic:"assigned"       ,target:"Application_Component"  ,rel_name:"assigns"       }
	,{source:"Application_Component"     ,semantic:"CRUDs"            ,r_semantic:"CRUD by"        ,target:"Application_Data_Object",rel_name:"access"        }
	,{source:"Application_Component"     ,semantic:"send data to"     ,r_semantic:"gets data from" ,target:"Application_Component"  ,rel_name:"flow"          }
	,{source:"Application_Component"     ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Application_Service"    ,rel_name:"realization"   }
	,{source:"Application_Service"       ,semantic:"uses"             ,r_semantic:"is used by"     ,target:"Application_Service"    ,rel_name:"uses"          }
	,{source:"Application_Service"       ,semantic:"contains"         ,r_semantic:"is contained by",target:"Application_Service"    ,rel_name:"contains"      }
	,{source:"Application_Service"       ,semantic:"uses"             ,r_semantic:"is used by"     ,target:"Application_Component"  ,rel_name:"uses"          }
	,{source:"Application_Function"      ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Application_Service"    ,rel_name:"realization"   }
	,{source:"Application_Service"       ,semantic:"CRUDs"            ,r_semantic:"CRUD by"        ,target:"Application_Data_Object",rel_name:"access"        }
	,{source:"Technology_Artifact"       ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Application_Data_Object",rel_name:"realization"   }
	,{source:"Application_Data_Object"   ,semantic:"composed of"      ,r_semantic:"composed by"    ,target:"Application_Data_Object",rel_name:"composition"   }
	,{source:"Application_Data_Object"   ,semantic:"specialization of",r_semantic:"generalized by" ,target:"Application_Data_Object",rel_name:"specialization"}
	,{source:"Application_Data_Object"   ,semantic:"contains"         ,r_semantic:"is contained by",target:"Application_Data_Object",rel_name:"contains"      }
	,{source:"Application_Function"      ,semantic:"CRUDs"            ,r_semantic:"CRUD by"        ,target:"Application_Data_Object",rel_name:"access"        }
	,{source:"Motivation_Stakeholder"    ,semantic:"gives data to"    ,r_semantic: "gets data from",target:"Motivation_Stakeholder" ,rel_name:"flow"          }
	,{source:"Common_Group"              ,semantic:"contains"         ,r_semantic:"is contained by",target:"Common_Group"           ,rel_name:"contains"      }

	,{source:"Business_Service"          ,semantic:"assigned to"      ,r_semantic:"assigned to"    ,target:"Business_Interface"     ,rel_name:"assigns"       }
	,{source:"Business_Service"          ,semantic:"is used by"       ,r_semantic:"uses"           ,target:"Business_Interface"     ,rel_name:"uses"          }
	,{source:"Technology_Software"       ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Technology_Service"     ,rel_name:"realization"   }
	,{source:"Technology_Node"           ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Technology_Service"     ,rel_name:"realization"   }
	,{source:"Technology_Node"           ,semantic:"uses"             ,r_semantic:"is used by"     ,target:"Technology_Service"     ,rel_name:"uses"          }
	,{source:"Application_Service"       ,semantic:"uses"             ,r_semantic:"is used by"     ,target:"Application_Interface"  ,rel_name:"uses"          }
	,{source:"Application_Service"       ,semantic:"assigned to"      ,r_semantic:"assigned to"    ,target:"Application_Interface"  ,rel_name:"assigns"       }
	,{source:"Application_Data_Object"   ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Business_Object"        ,rel_name:"realization"   }
	,{source:"Business_Role"             ,semantic:"uses"             ,r_semantic:"is used by"     ,target:"Application_Interface"  ,rel_name:"uses"          }
	,{source:"Application_Function"      ,semantic:"uses"             ,r_semantic:"is used by"     ,target:"Technology_Service"     ,rel_name:"uses"          }
	,{source:"Technology_Software"       ,semantic:"CRUDs"            ,r_semantic:"CRUD by"        ,target:"Technology_Artifact"    ,rel_name:"access"        }
	,{source:"Business_Service"          ,semantic:"assigned to"      ,r_semantic:"assigned to"    ,target:"Business_Interface"     ,rel_name:"assigns"       }
	,{source:"Technology_Node"           ,semantic:"CRUDs"            ,r_semantic:"CRUD by"        ,target:"Technology_Artifact"    ,rel_name:"access"        }
	,{source:"Technology_Software"       ,semantic:"assigned to"      ,r_semantic:"assigned to"    ,target:"Technology_Device"      ,rel_name:"assigns"       }
	,{source:"Technology_Network"        ,semantic:"associated with"  ,r_semantic:"associated with",target:"Technology_Device"      ,rel_name:"association"   }
	,{source:"Technology_Device"         ,semantic:"composed of"      ,r_semantic:"composed by"    ,target:"Technology_Interface"   ,rel_name:"composition"   }
	,{source:"Application_Component"     ,semantic:"uses"             ,r_semantic:"is used by"     ,target:"Technology_Interface"   ,rel_name:"uses"          }
	,{source:"Technology_Service"        ,semantic:"assigned"         ,r_semantic:"assigned"       ,target:"Technology_Interface"   ,rel_name:"assigns"       }

//MOTIVATION
	,{source:"Motivation_Stakeholder"    ,semantic:"associated with"  ,r_semantic:"associated with",target:"Motivation_Driver"      ,rel_name:"association"   }
	,{source:"Motivation_Principle"      ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Motivation_Goal"        ,rel_name:"realization"   }
	,{source:"Motivation_Driver"         ,semantic:"influences"       ,r_semantic:"influenced by"  ,target:"Motivation_Goal"        ,rel_name:"influence"     }
	,{source:"Motivation_Constraint"     ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Motivation_Principle"   ,rel_name:"realization"   }
	,{source:"Motivation_Requirement"    ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Motivation_Principle"   ,rel_name:"realization"   }
	,{source:"Motivation_Requirement"    ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Motivation_Goal"        ,rel_name:"realization"   }
	,{source:"Motivation_Constraint"     ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Motivation_Goal"        ,rel_name:"realization"   }
	,{source:"Application_Component"     ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Motivation_Requirement" ,rel_name:"realization"   }
	,{source:"Application_Component"     ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Motivation_Constraint"  ,rel_name:"realization"   }

//IMPLEMENTATION
	,{source:"Implementation_Work_Package",semantic:"assigned"         ,r_semantic:"assigned"       ,target:"Business_Role"         ,rel_name:"assigns"       }
	,{source:"Implementation_Work_Package",semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Implementation_Deliverable",rel_name:"realization"   }
	,{source:"Implementation_Deliverable" ,semantic:"realization of"   ,r_semantic:"realized by"    ,target:"Implementation_Plateau",rel_name:"realization"   }
	,{source:"Implementation_Plateau"     ,semantic:"associated with"  ,r_semantic:"associated with",target:"Implementation_Gap"      ,rel_name:"association"   }
	,{source:"Implementation_Plateau"     ,semantic:"contains"         ,r_semantic:"is contained by",target:"Application_Component"   ,rel_name:"contains"      }
	,{source:"Implementation_Gap"         ,semantic:"associated with"  ,r_semantic:"associated with",target:"Application_Component"   ,rel_name:"association"   }
	,{source:"Implementation_Deliverable" ,semantic:"contains"         ,r_semantic:"is contained by",target:"Application_Component"   ,rel_name:"contains"      }



	,{source:"Common_Group"              ,semantic:"contains"         ,r_semantic:"is contained by",target:"Application_Function"   ,rel_name:"contains"      }

];

		var inserted = 0;
		for (var i=0; i < relationships.length; i++) {
			var rel = {
				source:	relationships[i].source
				,semantic: relationships[i].semantic
				,target: relationships[i].target
				,rel_name: relationships[i].rel_name
			};
			EA_Relationships.insert(rel);
			inserted++;

			var r_rel = {
				source:	relationships[i].target
				,semantic: relationships[i].r_semantic
				,target: relationships[i].source
				,rel_name: relationships[i].rel_name
			};
			EA_Relationships.insert(r_rel);
			inserted++;
		}

		var found = EA_Relationships.find().count();

		console.log('FINISHED RELOADING EA_RELATIONSHIPS');
		console.log('Num of base relationships: '+relationships.length);
		console.log('Num of loaded EA_Relationships: '+inserted);
		console.log('Num of loaded EA_Relationships found: '+found);

		return [inserted, found];
	}

});
