// Local (client-only) collection
Errors = new Meteor.Collection(null);

/**
 * Throw error for display
 * messageType can be 'w' (warning) or 'i' (info) or 's' (success) DEFAULT is (danger)
 */
throwError = function(message, messageType, hideSnark) {
	Errors.insert({message: message, seen: false, messageType: messageType, hideSnark: hideSnark});
	Meteor.MyClientModule.scrollToTopOfPageFast();
}

clearErrors = function() {
  Errors.remove({seen: true});
}