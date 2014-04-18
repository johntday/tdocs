Meteor.reactivePublish(null, function() {
	var returnArray = [];

	if (this.userId) {
		var user = Meteor.users.findOne({_id: this.userId}, {reactive: true});
		if (user.roles) {
			var myprojects = _.keys(user.roles);
			if (!myprojects)
				myprojects = [];
			var query =  {_id: {$in: myprojects} };

			returnArray.push( Projects.find( query, {sort: {title: 1}} ) );
		}
		if (user.project) {
			var project_id = user.project._id;
			if (project_id) {
//				returnArray.push( Glossarys.find( {project_id: project_id} ) );
//				returnArray.push( Diagrams.find( {project_id: project_id} ) );
//				returnArray.push( Tdocs.find( {project_id: project_id} ) );
//				returnArray.push( Tables.find( {project_id: project_id} ) );

				returnArray.push( Nouns.find( {project_id: project_id} ) );
				returnArray.push( Relationships.find( {project_id: project_id} ) );
			}
		}
	}

	return returnArray;
});

/**
 * Filter
 */
Meteor.FilterCollections.publish(Nouns, {
	name: 'nouns-full'
});
Meteor.FilterCollections.publish(Nouns, {
	name: 'possible-rels-for-noun'
});
Meteor.FilterCollections.publish(Nouns, {
	name: 'nouns-simple'
});
Meteor.FilterCollections.publish(EA_Relationships, {
	name: 'ea-relationships'
});
Meteor.FilterCollections.publish(Relationships, {
	name: 'nouns-rels'
});
Meteor.FilterCollections.publish(Diagrams, {
	name: 'diagrams',
	callbacks: {
//		allow: function(query, handler){
//			//... do some custom validation (like user permissions)...
//			return false;
//		},
		beforePublish: function(query, handler){
			var u;
			if (handler.userId)
				u = Meteor.users.findOne({_id: handler.userId});
			var project_id = (u && u.project) ? u.project._id : '';

			query.selector.project_id = project_id;

			return query;
//		},
//		afterPublish: function(cursor){
//			//... your cursor modifier code goes here ...
//			return cursor;
		}
	}
});
Meteor.FilterCollections.publish(Diagrams, {
	name: 'diagrams-pic',
	callbacks: {
		beforePublish: function(query, handler){
			var u;
			if (handler.userId)
				u = Meteor.users.findOne({_id: handler.userId});
			var project_id = (u && u.project) ? u.project._id : '';

			query.selector.project_id = project_id;

			return query;
		}
	}
});
Meteor.FilterCollections.publish(Diagrams, {
	name: 'diagrams-nouns',
	callbacks: {
		beforePublish: function(query, handler){
			var u;
			if (handler.userId)
				u = Meteor.users.findOne({_id: handler.userId});
			var project_id = (u && u.project) ? u.project._id : '';

			query.selector.project_id = project_id;

			return query;
		}
	}
});

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
		var query = findUsersByRoles(id, true, null);
		return [
			Projects.find(id),
			Meteor.users.find( query )
		];
});

/**
 * Roles by project
 * TODO:  fix me
 */
Meteor.publish(null, function (){
	return Meteor.roles.find({})
});

/**
 * EA_Relationships
 */
Meteor.publish(null, function (){
	return EA_Relationships.find({});
});

/**
 * Stats / Counts
 */
//Meteor.publish('pubsub_stats_glossarys_cnt', function() {
//	var count;
//	var handle;
//	var initializing;
//	var _this = this;
//
//	count = 0;
//	initializing = true;
//	handle = Glossarys.find().observeChanges({
//		added: function() {
//			count++;
//			if (!initializing) {
//				return _this.changed('glossarys_cnt', 1, {
//					count: count
//				});
//			}
//		},
//		removed: function() {
//			count--;
//			return _this.changed('glossarys_cnt', 1, {
//				count: count
//			});
//		}
//	});
//	initializing = false;
//	this.added('glossarys_cnt', 1, {
//		count: count
//	});
//	this.ready();
//	return this.onStop(function() {
//		return handle.stop();
//	});
//});
//Meteor.publish('pubsub_stats_tdocs_cnt', function() {
//	var count;
//	var handle;
//	var initializing;
//	var _this = this;
//
//	count = 0;
//	initializing = true;
//	handle = Tdocs.find().observeChanges({
//		added: function() {
//			count++;
//			if (!initializing) {
//				return _this.changed('tdocs_cnt', 1, {
//					count: count
//				});
//			}
//		},
//		removed: function() {
//			count--;
//			return _this.changed('tdocs_cnt', 1, {
//				count: count
//			});
//		}
//	});
//	initializing = false;
//	this.added('tdocs_cnt', 1, {
//		count: count
//	});
//	this.ready();
//	return this.onStop(function() {
//		return handle.stop();
//	});
//});
//Meteor.publish('pubsub_stats_diagrams_cnt', function() {
//	var count;
//	var handle;
//	var initializing;
//	var _this = this;
//
//	count = 0;
//	initializing = true;
//	handle = Diagrams.find().observeChanges({
//		added: function() {
//			count++;
//			if (!initializing) {
//				return _this.changed('diagrams_cnt', 1, {
//					count: count
//				});
//			}
//		},
//		removed: function() {
//			count--;
//			return _this.changed('diagrams_cnt', 1, {
//				count: count
//			});
//		}
//	});
//	initializing = false;
//	this.added('diagrams_cnt', 1, {
//		count: count
//	});
//	this.ready();
//	return this.onStop(function() {
//		return handle.stop();
//	});
//});
//Meteor.publish('pubsub_stats_tables_cnt', function() {
//	var count;
//	var handle;
//	var initializing;
//	var _this = this;
//
//	count = 0;
//	initializing = true;
//	handle = Tables.find().observeChanges({
//		added: function() {
//			count++;
//			if (!initializing) {
//				return _this.changed('tables_cnt', 1, {
//					count: count
//				});
//			}
//		},
//		removed: function() {
//			count--;
//			return _this.changed('tables_cnt', 1, {
//				count: count
//			});
//		}
//	});
//	initializing = false;
//	this.added('tables_cnt', 1, {
//		count: count
//	});
//	this.ready();
//	return this.onStop(function() {
//		return handle.stop();
//	});
//});


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
