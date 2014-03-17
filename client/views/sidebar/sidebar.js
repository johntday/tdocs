Template.tmplSidebar.helpers({
	pickedProject: function() {
		return Meteor.user() && !!getProjectId();
	},
	chevronLeft: function() {
		return (Session.get('sidebar_nbr') > 2);
	},
	chevronRight: function() {
		return (Session.get('sidebar_nbr') < 10);
	}
});

Template.tmplSidebar.events({
	'click button.btn.btn-default.btn-sm': function(e) {
		e.preventDefault();
		var selected = getSelected();
		if(!selected._id) { return false; }
		Router.go('/nouns/'+selected._id);
	},
	'click #btn-sidebar-help': function() {
		bootbox.dialog({
			title: "Sidebar Help"
			,message: "<h3>Buttons</h3>" +
				"<ul>" +
				"<li><button class='btn btn-info btn-sm'><span class='glyphicon glyphicon-question-sign'></span> </button> This help dialog</li>" +
				"<li><button class='btn btn-success btn-sm'><span class='glyphicon glyphicon-plus'></span> </button> Add an item under selected parent</li>" +
				"<li><button class='btn btn-warning btn-sm'><span class='glyphicon glyphicon-pencil'></span> </button> Edit title of the selected item</li>" +
				"<li><button class='btn btn-danger btn-sm'><span class='glyphicon glyphicon-remove'></span> </button> Delete the selected item</li>" +
				"<li><button class='btn btn-default btn-sm'><span class='glyphicon glyphicon-folder-open'></span> </button> Open all (select an item first)</li>" +
				"<li><button class='btn btn-default btn-sm'><span class='glyphicon glyphicon-folder-close'></span> </button> Close all (select an item first)</li>" +
				"<li><button class='btn btn-default btn-sm'><span class='glyphicon glyphicon-arrow-right'></span> </button> Goto selected item</li>" +
				"</ul>" +
				"<h3>Actions</h3>" +
				"<ul>" +
				"<li><b>Drag and Drop</b>: select and move item to drop to another spot</li>" +
				"</ul>"
			,buttons: {
				main: {
					label: "OK",
					className: "btn-primary",
					callback: function() {
					}
				}
			}
		});
	},
	'click button.btn.btn-success.btn-sm': function(e) {
		var selected = getSelected();
		var sel = selected._id;
		if(!sel) { growl("Select a parent item first.  Your new item will be place under this parent"); return false; }
		sel = sidebar[selected.class_name].create_node(sel);
		if(sel) {
			sidebar[selected.class_name].edit(sel);
		} else
			growl("Select a parent item first.  Your new item will be place under this parent");
	},
	'click button.btn.btn-warning.btn-sm': function(e) {
		var selected = getSelected();
		var _id = selected._id;
		if(!_id) { growl("Select an item first"); return false; }
		if (selected.type !== 'root')
			sidebar[selected.class_name].edit(_id);
		else
			growl("Cannot edit this item");
	},
	'click button.btn.btn-danger.btn-sm': function(e) {
		var selected = getSelected();
		var _id = selected._id;
		if(!_id) { growl("Select an item first"); return false; }
		if (selected.type !== 'root' && selected.type !== 'top') {
			sidebar[selected.class_name].delete_node(_id);
		} else {
			growl("Cannot delete this item");
		}
	},
	'click #btn-open-all': function() {
		var selected = getSelected();
		var _id = selected._id;
		if(!_id) { growl("Select an item first"); return false; }
		sidebar[selected.class_name].open_all();
	},
	'click #btn-close-all': function() {
		var selected = getSelected();
		var _id = selected._id;
		if(!_id) { growl("Select an item first"); return false; }
		sidebar[selected.class_name].close_all();
	},
	'click #sidebar_left': function() {
		var nbr = Session.get('sidebar_nbr');
		if (nbr > 2)
			Session.set('sidebar_nbr', (nbr-1) );
	},
	'click #sidebar_right': function() {
		var nbr = Session.get('sidebar_nbr');
		if (nbr < 10)
			Session.set('sidebar_nbr', (nbr+1) );
	}

});

Template.tmplSidebar.rendered = function() {
	var class_names = _.keys(ea.classBelongsToArea);
	class_names.forEach(function(class_name){
		var obj = ea.classBelongsToArea[class_name];
		if (obj && !sidebar[class_name]) {
			refreshBusCap(class_name, obj.children_name);
		}
	});
	openAccordian();

//	if (!sidebar.Business_Capability)
//		refreshBusCap(ea.class_name.Business_Capability, 'contained_business_capabilities');
//	if (!sidebar.Business_Domain)
//		refreshBusCap(ea.class_name.Business_Domain, 'contained_business_domains');
//	if (!sidebar.Business_Role_Type)
//		refreshBusCap(ea.class_name.Business_Role_Type, 'children');
//	if (!sidebar.Business_Principle)
//		refreshBusCap(ea.class_name.Business_Principle, 'children');
//	if (!sidebar.Business_Driver)
//		refreshBusCap(ea.class_name.Business_Driver, 'children');
//	if (!sidebar.Business_Objective)
//		refreshBusCap(ea.class_name.Business_Objective, 'children');
//	if (!sidebar.Business_Activity)
//		refreshBusCap(ea.class_name.Business_Activity, 'children');
//	if (!sidebar.Application_Architecture_Principle)
//		refreshBusCap(ea.class_name.Application_Architecture_Principle, 'children');
//	if (!sidebar.Application_Capability)
//		refreshBusCap(ea.class_name.Application_Capability, 'contained_app_capabilities');


};

Template.tmpl_accordian_test.rendered = function() {
	if (isFirst) {
		$('#busLayer, #appLayer').on('show.bs.collapse', function (e) {
			console.log('hi: '+ e.currentTarget.id);
			accordian.open = e.currentTarget.id;
		});
		isFirst = false;
	}
	openAccordian();
};

var getSelected = function() {
	return Session.get('selected_tree_noun');
};
var openAccordian = function() {
	if (accordian.open) {
		accordian.ids.forEach(function(id){
			if (id === accordian.open)
				$('#'+id).collapse('show');
			else
				$('#'+id).collapse('hide');
		});
	}
};
var isFirst = true;