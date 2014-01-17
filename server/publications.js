/**
 * Tdocs
 */
Meteor.publish('pubsub_tdoc_list', function(query, options, limit) {
	options = options || {};
	options.limit = limit;
	return Tdocs.find(query || {}, options);
});
Meteor.publish('pubsub_selected_tdoc', function(id) {
	return Tdocs.find(id);
});

/**
 * Diagrams
 */
Meteor.publish('pubsub_diagram_list', function(query, options, limit) {
	options = options || {};
	options.limit = limit;
	return Diagrams.find(query || {}, options);
});
Meteor.publish('pubsub_selected_diagram', function(id) {
	return Diagrams.find(id);
});

/**
 * Persons
 */
Meteor.publish('pubsub_person_list', function(query, options, limit) {
	options = options || {};
	options.limit = limit;
	return Persons.find(query || {}, options);
});
Meteor.publish('pubsub_selected_person', function(id) {
	return Persons.find(id);
});

/**
 * Glossarys
 */
Meteor.publish('pubsub_glossary_list', function(query, options, limit) {
	options = options || {};
	options.limit = limit;
	return Glossarys.find(query || {}, options);
});
Meteor.publish('pubsub_selected_glossary', function(id) {
	return Glossarys.find(id);
});

/**
 * Stats
 */
Meteor.publish('stats', function() {
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
				//return _this.changed('persons_count', 1, {
				return _this.changed('stats', 1, {
					count: count
				});
			}
		},
		removed: function() {
			count--;
			return _this.changed('stats', 1, {
				count: count
			});
		}
	});
	initializing = false;
	this.added('stats', 1, {
		count: count
	});
	this.ready();
	return this.onStop(function() {
		return handle.stop();
	});
});
