Accounts.config({
	sendVerificationEmail: false
});
Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
	//passwordSignupFields: 'EMAIL_ONLY'
});

Accounts.emailTemplates = {
	from: "Meteor Accounts <no-reply@idiagram.net>",
	siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),

	resetPassword: {
		subject: function(user) {
			return "How to reset your password on " + Accounts.emailTemplates.siteName;
		},
		text: function(user, url) {
			var greeting = (user.profile && user.profile.name) ?
			               ("Hello " + user.profile.name + ",") : "Hello,";
			return greeting + "\n"
				+ "\n"
				+ "To reset your password, simply click the link below.\n"
				+ "\n"
				+ url + "\n"
				+ "\n"
				+ "Thanks.\n";
		}
	},
	verifyEmail: {
		subject: function(user) {
			return "How to verify email address on " + Accounts.emailTemplates.siteName;
		},
		text: function(user, url) {
			var greeting = (user.profile && user.profile.name) ?
			               ("Hello " + user.profile.name + ",") : "Hello,";
			return greeting + "\n"
				+ "\n"
				+ "To verify your account email, simply click the link below.\n"
				+ "\n"
				+ url + "\n"
				+ "\n"
				+ "Thanks.\n";
		}
	},
	enrollAccount: {
		subject: function(user) {
			return "An account has been created for you on " + Accounts.emailTemplates.siteName;
		},
		text: function(user, url) {
			var greeting = (user.profile && user.profile.name) ?
			               ("Hello " + user.profile.name + ",") : "Hello,";
			return greeting + "\n"
				+ "\n"
				+ "To start using the service, simply click the link below.\n"
				+ "\n"
				+ url + "\n"
				+ "\n"
				+ "Thanks.\n";
		}
	}
};