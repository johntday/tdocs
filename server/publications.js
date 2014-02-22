/**
 * Tags: common for all name-value objects (e.g. tags)
 * TYPE:  project, tag
 */
Meteor.publish('pubsub_tag_list', function(query, options, limit) {
	options = options || {}; options.limit = limit;
	return Tags.find(query || {}, options);
});
Meteor.publish('pubsub_selected_tag', function(id) {
	// TODO: maybe add details here
	return Tags.find(id);
});

/**
 * Nouns:  common for all listable objects
 */
//Meteor.publish('pubsub_noun_list', function(query, options, limit) {
//	options = options || {};
//	options.limit = limit;
//	return Nouns.find(query || {}, options);
//});
//Meteor.publish('pubsub_selected_noun', function(id) {
//	// TODO: maybe add details here
//	return Nouns.find(id);
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
		return [ Projects.find(id), Meteor.users.find({roles: id}) ];
	} else {
		return Projects.find(id);
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
