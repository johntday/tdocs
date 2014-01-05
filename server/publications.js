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
 * Stats
 */
Meteor.publish('stats', function() {
	var count;
	var handle;
	var initializing;
	var _this = this;

	count = 0;
	initializing = true;
	handle = Persons.find().observeChanges({
		added: function() {
			count++;
			if (!initializing) {
				return _this.changed('persons_count', 1, {
					count: count
				});
			}
		},
		removed: function() {
			count--;
			return _this.changed('persons_count', 1, {
				count: count
			});
		}
	});
	initializing = false;
	this.added('persons_count', 1, {
		count: count
	});
	this.ready();
	return this.onStop(function() {
		return handle.stop();
	});
});
