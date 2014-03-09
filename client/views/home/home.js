Template.tmplHome.helpers({
	pickedProject: function() {
		return !(Meteor.user() && !!getProjectId());
	},
	notLoggedIn: function() {
		return !Meteor.user();
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
//Template.tmplHome.events({
//	'click #btn-create-a-project': function() {
//		Router.go('/projectAdd');
//	}
//});
/*------------------------------------------------------------------------------------------------------------------------------*/
//Template.tmplHome.rendered = function() {
//
//	var data = [
//		{
//			field_1: "value1",
//			field_2: "value2"
//		}, {
//			field_1: "value3",
//			field_2: "value4"
//		}
//	];
//	var cols = [
//		{ id: "field_1", name: "Field 1", field: "field_1" },
//		{ id: "field_2", name: "Field 2", field: "field_2" }
//	];
//
//	var options = {
//		enableCellNavigation: true,
//		enableColumnReorder: false
//	};
//
//	var slickgrid = new Slick.Grid('#example', data, cols, options);
//};
