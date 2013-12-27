Template.tmplErrors.helpers({
	errors: function() {
		clearErrors();
		return Errors.find();
	}
});

Template.tmplError.helpers({
	snark: function() {
		return Meteor.MyClientModule.getRandomSnarkText();
	}
});

Template.tmplError.rendered = function() {
	var error = this.data;
	Meteor.defer(function() {
		Errors.update(error._id, {$set: {seen: true}});
	});
};
