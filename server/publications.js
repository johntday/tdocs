//Meteor.reactivePublish(null, function() {
//	if (this.userId) {
//		var user = Meteor.users.findOne({_id: this.userId}, {reactive: true});
//		if (!user.project_id) {
//			if (!user.roles) {
//				var properties = {
//					type: TYPES.project
//					, title: 'Default'
//					, description: 'Default'
//				};
//				var project_id = '';
//				Meteor.call('createProject', properties, function(error, project) {
//					if(error){
//						console.log(JSON.stringify(error));
//						throwError(error.reason);
//					} else {
//						project_id = project.projectId;
//					}
//				});
//				Meteor.users.update(this.userId, {$set: {project_id: project_id}});
//			} else {
//
//			}
//		}
//		if (user.project_id) {
//			var project = Projects.findOne({_id: user.project_id}, {reactive: true});
//			return [
//				Tdocs.find({project_id: user.project_id})
//				,Diagrams.find({project_id: user.project_id})
//				,Glossarys.find({project_id: user.project_id})
//				,Tables.find({project_id: user.project_id})
//		    ];
//		}
//	}
//});

/**
 * Tdocs
 */
Meteor.publish('pubsub_tdoc_list', function(query, options, limit) {
	options = options || {}; options.limit = limit;
	return Tdocs.find(query || {}, options);
});
Meteor.publish('pubsub_selected_tdoc', function(id) {
	return Tdocs.find(id);
});

/**
 * Diagrams
 */
Meteor.publish('pubsub_diagram_list', function(query, options, limit) {
	options = options || {}; options.limit = limit;
	return Diagrams.find(query || {}, options);
});
Meteor.publish('pubsub_selected_diagram', function(id) {
	return Diagrams.find(id);
});

/**
 * Persons
 */
Meteor.publish('pubsub_person_list', function(query, options, limit) {
	options = options || {}; options.limit = limit;
	return Persons.find(query || {}, options);
});
Meteor.publish('pubsub_selected_person', function(id) {
	return Persons.find(id);
});

/**
 * Glossarys
 */
Meteor.publish('pubsub_glossary_list', function(query, options, limit) {
	options = options || {}; options.limit = limit;
	return Glossarys.find(query || {}, options);
});
Meteor.publish('pubsub_selected_glossary', function(id) {
	return Glossarys.find(id);
});

/**
 * Tables
 */
Meteor.publish('pubsub_table_list', function(query, options, limit) {
	options = options || {}; options.limit = limit;
	return Tables.find(query || {}, options);
});
Meteor.publish('pubsub_selected_table', function(id) {
	return Tables.find(id);
});

/**
 * Projects
 */
Meteor.publish('pubsub_project_list', function(query, options, limit) {
	options = options || {}; options.limit = limit;
	return Projects.find(query || {}, options);
});
Meteor.publish('pubsub_selected_project', function(id) {
	if (Roles.userIsInRole(this.userId, ['admin','author','read'], id)) {
		var query = findUsersByRoles(id);
		return [
			Projects.find(id),
			Meteor.users.find( query )
		];
	} else {
		// user not authorized. do not publish secrets
		this.stop();
		return;
	}
});

/**
 * Roles by project
 * TODO:  fix me
 */
Meteor.publish(null, function (){
	return Meteor.roles.find({})
});

/**
 * Stats / Counts
 */
Meteor.publish('pubsub_stats_glossarys_cnt', function() {
	var count;
	var handle;
	var initializing;
	var _this = this;

	count = 0;
	initializing = true;
	handle = Glossarys.find().observeChanges({
		added: function() {
			count++;
			if (!initializing) {
				return _this.changed('glossarys_cnt', 1, {
					count: count
				});
			}
		},
		removed: function() {
			count--;
			return _this.changed('glossarys_cnt', 1, {
				count: count
			});
		}
	});
	initializing = false;
	this.added('glossarys_cnt', 1, {
		count: count
	});
	this.ready();
	return this.onStop(function() {
		return handle.stop();
	});
});
Meteor.publish('pubsub_stats_tdocs_cnt', function() {
	var count;
	var handle;
	var initializing;
	var _this = this;

	count = 0;
	initializing = true;
	handle = Tdocs.find().observeChanges({
		added: function() {
			count++;
			if (!initializing) {
				return _this.changed('tdocs_cnt', 1, {
					count: count
				});
			}
		},
		removed: function() {
			count--;
			return _this.changed('tdocs_cnt', 1, {
				count: count
			});
		}
	});
	initializing = false;
	this.added('tdocs_cnt', 1, {
		count: count
	});
	this.ready();
	return this.onStop(function() {
		return handle.stop();
	});
});
Meteor.publish('pubsub_stats_diagrams_cnt', function() {
	var count;
	var handle;
	var initializing;
	var _this = this;

	count = 0;
	initializing = true;
	handle = Diagrams.find().observeChanges({
		added: function() {
			count++;
			if (!initializing) {
				return _this.changed('diagrams_cnt', 1, {
					count: count
				});
			}
		},
		removed: function() {
			count--;
			return _this.changed('diagrams_cnt', 1, {
				count: count
			});
		}
	});
	initializing = false;
	this.added('diagrams_cnt', 1, {
		count: count
	});
	this.ready();
	return this.onStop(function() {
		return handle.stop();
	});
});
Meteor.publish('pubsub_stats_tables_cnt', function() {
	var count;
	var handle;
	var initializing;
	var _this = this;

	count = 0;
	initializing = true;
	handle = Tables.find().observeChanges({
		added: function() {
			count++;
			if (!initializing) {
				return _this.changed('tables_cnt', 1, {
					count: count
				});
			}
		},
		removed: function() {
			count--;
			return _this.changed('tables_cnt', 1, {
				count: count
			});
		}
	});
	initializing = false;
	this.added('tables_cnt', 1, {
		count: count
	});
	this.ready();
	return this.onStop(function() {
		return handle.stop();
	});
});
Meteor.publish('pubsub_stats_projects_cnt', function() {
	var count;
	var handle;
	var initializing;
	var _this = this;

	count = 0;
	initializing = true;
	handle = Projects.find().observeChanges({
		added: function() {
			count++;
			if (!initializing) {
				return _this.changed('projects_cnt', 1, {
					count: count
				});
			}
		},
		removed: function() {
			count--;
			return _this.changed('projects_cnt', 1, {
				count: count
			});
		}
	});
	initializing = false;
	this.added('projects_cnt', 1, {
		count: count
	});
	this.ready();
	return this.onStop(function() {
		return handle.stop();
	});
});


/**
 * Better way to to Stats publish, but requires subscribe in Deps.autorun
 * need to think if this is an issue
 */
//publishCollectionCount = function(pubsub_name, collection, selector, cntName) {
//
//	Meteor.publish( pubsub_name, function() {
//		var count;
//		var handle;
//		var initializing;
//		var _this = this;
//
//		count = 0;
//		initializing = true;
//		handle = collection.find(selector).observeChanges({
//			added: function() {
//				count++;
//				if (!initializing) {
//					return _this.changed(cntName, 1, {
//						count: count
//					});
//				}
//			},
//			removed: function() {
//				count--;
//				return _this.changed(cntName, 1, {
//					count: count
//				});
//			}
//		});
//		initializing = false;
//		_this.added(cntName, 1, {
//			count: count
//		});
//		_this.ready();
//		return _this.onStop(function() {
//			return handle.stop();
//		});
//	});
//};
//publishCollectionCount('pubsub_stats_diagrams_cnt', Diagrams, {}, 'diagrams_cnt');
