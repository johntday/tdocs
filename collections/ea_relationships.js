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
			//,{Technology_Communication_Path:{}}
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
//BUSINESS
	{source:"Business_Actor"            ,semantic:"sends data to"    ,target:"Business_Actor"            ,rel_name:"flow"          }
	,{source:"Business_Actor"            ,semantic:"assigned"         ,target:"Business_Location"         ,rel_name:"assigns"       }

	,{source:"Business_Role"             ,semantic:"sends data to"    ,target:"Business_Role"             ,rel_name:"flow"          }
	,{source:"Business_Role"             ,semantic:"uses"             ,target:"Business_Service"          ,rel_name:"uses"          }
	,{source:"Business_Role"             ,semantic:"assigned"         ,target:"Business_Process"          ,rel_name:"assigns"       }
	,{source:"Business_Role"             ,semantic:"assigned"         ,target:"Business_Actor"            ,rel_name:"assigns"       }
	,{source:"Business_Role"             ,semantic:"uses"             ,target:"Business_Interface"        ,rel_name:"uses"          }
	,{source:"Business_Role"             ,semantic:"uses"             ,target:"Application_Interface"     ,rel_name:"uses"          }
	,{source:"Business_Role"             ,semantic:"composed of"      ,target:"Business_Interface"        ,rel_name:"composition"   }

	,{source:"Business_Process"          ,semantic:"realization of"   ,target:"Business_Service"          ,rel_name:"realization"   }
	,{source:"Business_Process"          ,semantic:"flows to"         ,target:"Business_Process"          ,rel_name:"flow"          }
	,{source:"Business_Process"          ,semantic:"uses"             ,target:"Application_Service"       ,rel_name:"uses"          }
	,{source:"Business_Process"          ,semantic:"CRUDs"            ,target:"Business_Object"           ,rel_name:"access"        }
	,{source:"Business_Process"          ,semantic:"contains"         ,target:"Business_Process"          ,rel_name:"contains"      }
	,{source:"Business_Process"          ,semantic:"uses"             ,target:"Business_Function"         ,rel_name:"uses"          }
	,{source:"Business_Process"          ,semantic:"sends data to"    ,target:"Business_Function"         ,rel_name:"flow"          }

	,{source:"Business_Function"         ,semantic:"realization of"   ,target:"Business_Service"          ,rel_name:"realization"   }
	,{source:"Business_Function"         ,semantic:"contains"         ,target:"Business_Process"          ,rel_name:"contains"      }
	,{source:"Business_Function"         ,semantic:"assigned"         ,target:"Business_Role"             ,rel_name:"assigns"       }
	,{source:"Business_Function"         ,semantic:"CRUDs"            ,target:"Business_Object"           ,rel_name:"access"        }
	,{source:"Business_Function"         ,semantic:"CRUDs"            ,target:"Business_Function"         ,rel_name:"access"        }
	,{source:"Business_Function"         ,semantic:"uses"             ,target:"Business_Function"         ,rel_name:"uses"          }
	,{source:"Business_Function"         ,semantic:"sends data to"    ,target:"Business_Function"         ,rel_name:"flow"          }
	,{source:"Business_Function"         ,semantic:"uses"             ,target:"Business_Process"          ,rel_name:"uses"          }

	,{source:"Business_Service"          ,semantic:"uses"             ,target:"Business_Service"          ,rel_name:"uses"          }
	,{source:"Business_Service"          ,semantic:"contains"         ,target:"Business_Service"          ,rel_name:"contains"      }
	,{source:"Business_Service"          ,semantic:"CRUDs"            ,target:"Business_Object"           ,rel_name:"access"        }
	,{source:"Business_Service"          ,semantic:"assigned to"      ,target:"Business_Interface"        ,rel_name:"assigns"       }
	,{source:"Business_Service"          ,semantic:"is used by"       ,target:"Business_Interface"        ,rel_name:"uses"          }
	,{source:"Business_Service"          ,semantic:"assigned to"      ,target:"Business_Interface"        ,rel_name:"assigns"       }
	,{source:"Business_Service"          ,semantic:"assigned to"      ,target:"Application_Interface"     ,rel_name:"assigns"       }
	,{source:"Business_Service"          ,semantic:"uses"             ,target:"Business_Process"          ,rel_name:"uses"          }
	,{source:"Business_Service"          ,semantic:"uses"             ,target:"Business_Function"         ,rel_name:"uses"          }

	,{source:"Business_Event"            ,semantic:"triggers"         ,target:"Business_Process"          ,rel_name:"trigger"       }
	,{source:"Business_Event"            ,semantic:"assigned"         ,target:"Business_Role"             ,rel_name:"assigns"       }

	,{source:"Business_Object"           ,semantic:"contains"         ,target:"Business_Object"           ,rel_name:"contains"      }
	,{source:"Business_Object"           ,semantic:"composed of"      ,target:"Business_Object"           ,rel_name:"composition"   }
	,{source:"Business_Object"           ,semantic:"specialization of",target:"Business_Object"           ,rel_name:"specialization"}
	,{source:"Business_Object"           ,semantic:"assigned"         ,target:"Business_Location"         ,rel_name:"assigns"       }

	,{source:"Business_Product"          ,semantic:"has value"        ,target:"Business_Value"            ,rel_name:"association"   }
	,{source:"Business_Product"          ,semantic:"contains"         ,target:"Business_Contract"         ,rel_name:"contains"      }
	,{source:"Business_Product"          ,semantic:"contains"         ,target:"Business_Service"          ,rel_name:"contains"      }

//APPLICATION
	,{source:"Application_Component"     ,semantic:"composed of"      ,target:"Application_Component"     ,rel_name:"composition"   }
	,{source:"Application_Component"     ,semantic:"composed of"      ,target:"Application_Interface"     ,rel_name:"composition"   }
	,{source:"Application_Component"     ,semantic:"CRUDs"            ,target:"Application_Data_Object"   ,rel_name:"access"        }
	,{source:"Application_Component"     ,semantic:"send data to"     ,target:"Application_Component"     ,rel_name:"flow"          }
	,{source:"Application_Component"     ,semantic:"realization of"   ,target:"Application_Service"       ,rel_name:"realization"   }
	,{source:"Application_Component"     ,semantic:"uses"             ,target:"Technology_Interface"      ,rel_name:"uses"          }
	,{source:"Application_Component"     ,semantic:"realization of"   ,target:"Motivation_Requirement"    ,rel_name:"realization"   }
	,{source:"Application_Component"     ,semantic:"realization of"   ,target:"Motivation_Constraint"     ,rel_name:"realization"   }
	,{source:"Application_Component"     ,semantic:"uses"             ,target:"Application_Interface"     ,rel_name:"uses"          }
	,{source:"Application_Component"     ,semantic:"uses"             ,target:"Application_Component"     ,rel_name:"uses"          }
	,{source:"Application_Component"     ,semantic:"assigned"         ,target:"Business_Function"         ,rel_name:"assigns"       }
	,{source:"Application_Component"     ,semantic:"assigned"         ,target:"Business_Process"          ,rel_name:"assigns"       }

	,{source:"Application_Function"      ,semantic:"assigned"         ,target:"Application_Component"     ,rel_name:"assigns"       }
	,{source:"Application_Function"      ,semantic:"realization of"   ,target:"Application_Service"       ,rel_name:"realization"   }
	,{source:"Application_Function"      ,semantic:"CRUDs"            ,target:"Application_Data_Object"   ,rel_name:"access"        }
	,{source:"Application_Function"      ,semantic:"uses"             ,target:"Technology_Service"        ,rel_name:"uses"          }
	,{source:"Application_Function"      ,semantic:"uses"             ,target:"Technology_Service"        ,rel_name:"uses"          }
	,{source:"Application_Function"      ,semantic:"uses"             ,target:"Application_Service"       ,rel_name:"uses"          }
	,{source:"Application_Function"      ,semantic:"uses"             ,target:"Application_Function"      ,rel_name:"uses"          }
	,{source:"Application_Function"      ,semantic:"sends data to"    ,target:"Application_Function"      ,rel_name:"flow"          }

	,{source:"Application_Service"       ,semantic:"uses"             ,target:"Application_Service"       ,rel_name:"uses"          }
	,{source:"Application_Service"       ,semantic:"contains"         ,target:"Application_Service"       ,rel_name:"contains"      }
	,{source:"Application_Service"       ,semantic:"uses"             ,target:"Application_Component"     ,rel_name:"uses"          }
	,{source:"Application_Service"       ,semantic:"CRUDs"            ,target:"Application_Data_Object"   ,rel_name:"access"        }
	,{source:"Application_Service"       ,semantic:"uses"             ,target:"Application_Interface"     ,rel_name:"uses"          }
	,{source:"Application_Service"       ,semantic:"assigned to"      ,target:"Application_Interface"     ,rel_name:"assigns"       }
	,{source:"Application_Service"       ,semantic:"uses"             ,target:"Business_Function"         ,rel_name:"uses"          }
	,{source:"Application_Service"       ,semantic:"uses"             ,target:"Business_Process"          ,rel_name:"uses"          }

	,{source:"Technology_Artifact"       ,semantic:"realization of"   ,target:"Application_Data_Object"   ,rel_name:"realization"   }

	,{source:"Application_Data_Object"   ,semantic:"composed of"      ,target:"Application_Data_Object"   ,rel_name:"composition"   }
	,{source:"Application_Data_Object"   ,semantic:"specialization of",target:"Application_Data_Object"   ,rel_name:"specialization"}
	,{source:"Application_Data_Object"   ,semantic:"contains"         ,target:"Application_Data_Object"   ,rel_name:"contains"      }
	,{source:"Application_Data_Object"   ,semantic:"realization of"   ,target:"Business_Object"           ,rel_name:"realization"   }


	,{source:"Technology_Software"       ,semantic:"realization of"   ,target:"Technology_Service"        ,rel_name:"realization"   }
	,{source:"Technology_Software"       ,semantic:"assigned to"      ,target:"Technology_Device"         ,rel_name:"assigns"       }
	,{source:"Technology_Software"       ,semantic:"CRUDs"            ,target:"Technology_Artifact"       ,rel_name:"access"        }

	,{source:"Technology_Node"           ,semantic:"realization of"   ,target:"Technology_Service"        ,rel_name:"realization"   }
	,{source:"Technology_Node"           ,semantic:"uses"             ,target:"Technology_Service"        ,rel_name:"uses"          }
	,{source:"Technology_Node"           ,semantic:"CRUDs"            ,target:"Technology_Artifact"       ,rel_name:"access"        }
	,{source:"Technology_Node"           ,semantic:"Located at"       ,target:"Business_Location"         ,rel_name:"assigns"       }
	,{source:"Technology_Node"           ,semantic:"composed of"      ,target:"Technology_Interface"      ,rel_name:"composition"   }
	,{source:"Technology_Node"           ,semantic:"composed of"      ,target:"Technology_Software"       ,rel_name:"composition"   }

	,{source:"Technology_Function"       ,semantic:"realization of"   ,target:"Technology_Service"        ,rel_name:"realization"   }

	,{source:"Technology_Network"        ,semantic:"associated with"  ,target:"Technology_Device"         ,rel_name:"association"   }
	,{source:"Technology_Network"        ,semantic:"Located at"       ,target:"Business_Location"         ,rel_name:"assigns"       }

	,{source:"Technology_Device"         ,semantic:"composed of"      ,target:"Technology_Interface"      ,rel_name:"composition"   }
	,{source:"Technology_Device"         ,semantic:"specialization of",target:"Technology_Node"           ,rel_name:"specialization"}
	,{source:"Technology_Device"         ,semantic:"composed of"      ,target:"Technology_Node"           ,rel_name:"composition"   }

	,{source:"Technology_Service"        ,semantic:"assigned"         ,target:"Technology_Interface"      ,rel_name:"assigns"       }
	,{source:"Technology_Service"        ,semantic:"uses"             ,target:"Application_Component"     ,rel_name:"uses"          }

//MOTIVATION
	,{source:"Motivation_Stakeholder"    ,semantic:"associated with"  ,target:"Motivation_Driver"         ,rel_name:"association"   }
	,{source:"Motivation_Stakeholder"    ,semantic:"gives data to"    ,target:"Motivation_Stakeholder"    ,rel_name:"flow"          }

	,{source:"Motivation_Principle"      ,semantic:"realization of"   ,target:"Motivation_Goal"           ,rel_name:"realization"   }

	,{source:"Motivation_Driver"         ,semantic:"influences"       ,target:"Motivation_Goal"           ,rel_name:"influence"     }

	,{source:"Motivation_Constraint"     ,semantic:"realization of"   ,target:"Motivation_Principle"      ,rel_name:"realization"   }
	,{source:"Motivation_Constraint"     ,semantic:"realization of"   ,target:"Motivation_Goal"           ,rel_name:"realization"   }

	,{source:"Motivation_Requirement"    ,semantic:"realization of"   ,target:"Motivation_Principle"      ,rel_name:"realization"   }
	,{source:"Motivation_Requirement"    ,semantic:"realization of"   ,target:"Motivation_Goal"           ,rel_name:"realization"   }

//IMPLEMENTATION
	,{source:"Implementation_Work_Package",semantic:"assigned"        ,target:"Business_Role"             ,rel_name:"assigns"       }
	,{source:"Implementation_Work_Package",semantic:"realization of"  ,target:"Implementation_Deliverable",rel_name:"realization"   }

	,{source:"Implementation_Deliverable" ,semantic:"realization of"  ,target:"Implementation_Plateau"    ,rel_name:"realization"   }

	,{source:"Implementation_Plateau"     ,semantic:"associated with" ,target:"Implementation_Gap"        ,rel_name:"association"   }
	,{source:"Implementation_Plateau"     ,semantic:"contains"        ,target:"Application_Component"     ,rel_name:"contains"      }

	,{source:"Implementation_Gap"         ,semantic:"associated with" ,target:"Application_Component"     ,rel_name:"association"   }

	,{source:"Implementation_Deliverable" ,semantic:"contains"        ,target:"Application_Component"     ,rel_name:"contains"      }
	,{source:"Implementation_Deliverable" ,semantic:"realization of"  ,target:"Business_Object"           ,rel_name:"realization"   }

//GROUP
	,{source:"Common_Group"              ,semantic:"contains"         ,target:"Application_Function"      ,rel_name:"contains"      }
	,{source:"Common_Group"              ,semantic:"contains"         ,target:"Common_Group"              ,rel_name:"contains"      }

];

		var inserted = 0;
		for (var i=0; i < relationships.length; i++) {
			var rel = {
				source:	relationships[i].source
				,semantic: relationships[i].semantic
				,target: relationships[i].target
				,rel_name: relationships[i].rel_name
			};
			if ( insert_rel(rel) )
				inserted++;

			if ( _.contains(['assigns','association','trigger'], relationships[i].rel_name) ){
				var r_rel = {
					source:	relationships[i].target
					,semantic: relationships[i].semantic
					,target: relationships[i].source
					,rel_name: relationships[i].rel_name
				};
				if ( insert_rel(r_rel) )
					inserted++;
			}
		}

		var found = EA_Relationships.find().count();

		console.log('FINISHED RELOADING EA_RELATIONSHIPS');
		console.log('Num of base relationships: '+relationships.length);
		console.log('Num of loaded EA_Relationships: '+inserted);
		console.log('Num of loaded EA_Relationships found: '+found);

		return [inserted, found];
	}

});

function insert_rel(rel) {
	if ( ! EA_Relationships.findOne({source:rel.source, target:rel.target, rel_name:rel.rel_name}) ) {
		EA_Relationships.insert(rel);
		return true;
	}
	return false;
}