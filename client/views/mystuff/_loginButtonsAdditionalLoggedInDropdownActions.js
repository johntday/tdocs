Template._loginButtonsLoggedInDropdown.events({
	'click #login-buttons-edit-profile': function(e) {
		e.stopPropagation();
		//Template._loginButtons.toggleDropdown();
		//Template._loginButtons.toggleDropdown();
		Router.go('/profile');
	}
});
