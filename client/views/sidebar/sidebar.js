// "tmplSidebar"
Template.tmplSidebar.helpers({
	pickedProject: function() {
		return Meteor.user() && !!getProjectId();
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
};

// "tmpl_accordian_test"
Template.tmpl_accordian_test.rendered = function() {
	if (!Template.tmpl_accordian_test.isFirst) {
		Template.tmpl_accordian_test.isFirst = true;
		$('#busLayer, #appLayer, #techLayer, #implLayer, #modvLayer, #comLayer').on('show.bs.collapse', function (e) {
			accordian.open = e.currentTarget.id;
		});
	}
};
Template.tmpl_accordian_test.destroyed = function() {
	Template.tmpl_accordian_test.isFirst = null;
};

// "tmpl_sidebar_buttons"
Template.tmpl_sidebar_buttons.helpers({
	canEdit: function() {
		return canEdit( Meteor.user() );
	},
	gotoBtnTitle: function() {
		if ( Router.current().path.startsWith('/graph/') )
			return 'Add selected item to your diagram';
		return 'Goto selected item';
	},
	showingDiagram: function() {
		return Router.current().path.startsWith('/graph/');
	}
	//	chevronLeft: function() {
//		return (Session.get('sidebar_nbr') > 2);
//	},
//	chevronRight: function() {
//		return (Session.get('sidebar_nbr') < 10);
//	}
});
Template.tmpl_sidebar_buttons.events({
	'click #btn-sidebar-search': function(e) {
		e.preventDefault();
		$(e.currentTarget).blur();
		Router.go('/nouns');
	},
	'click #btn-sidebar-goto': function(e) {
		e.preventDefault();
		$(e.currentTarget).blur();
		var path = Router.current().path;
		if (path && path.indexOf('/graph/') != -1){
			addNounToGraph( getSelectedTreeItem() );
			return;
		}
		var selected = getSelectedTreeItem();
		if(!selected._id) {
			growl('Select an item in the left navbar');
			return false;
		}
		Router.go('/nouns/'+selected._id);
	},
	'click #btn-sidebar-help': function() {
		bootbox.dialog({
			title: "Sidebar Help"
			,message: "<h3>Buttons</h3>" +
				"<ul>" +
				"<li><button class='btn btn-info btn-sm'><span class='glyphicon glyphicon-question-sign'></span> </button> This help dialog</li>" +
				"<li><button class='btn btn-info btn-sm'><span class='glyphicon glyphicon-search'></span> </button>Search items</li>" +
				"<li><button class='btn btn-success btn-sm'><span class='glyphicon glyphicon-plus'></span> </button> Add an item under selected parent</li>" +
				"<li><button class='btn btn-warning btn-sm'><span class='glyphicon glyphicon-pencil'></span> </button> Edit title of the selected item</li>" +
				"<li><button class='btn btn-danger btn-sm'><span class='glyphicon glyphicon-remove'></span> </button> Delete the selected item</li>" +
				"<li><button class='btn btn-default btn-sm'><span class='glyphicon glyphicon-folder-open'></span> </button> Open all (select an item first)</li>" +
				"<li><button class='btn btn-default btn-sm'><span class='glyphicon glyphicon-folder-close'></span> </button> Close all (select an item first)</li>" +
				"<li><button class='btn btn-default btn-sm'><span class='glyphicon glyphicon-arrow-right'></span> </button> Goto selected item</li>" +
				//"<li><button class='btn btn-default btn-sm'><span class='glyphicon glyphicon-chevron-left'></span> </button> Narrow sidebar</li>" +
				//"<li><button class='btn btn-default btn-sm'><span class='glyphicon glyphicon-chevron-right'></span> </button> Widen sidebar</li>" +
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
		$(e.currentTarget).blur();
		var selected = getSelectedTreeItem();
		var sel = selected._id;
		if(!sel) { growl("Select a parent item first.  Your new item will be place under this parent"); return false; }
		sel = sidebar[selected.class_name].create_node(sel);
		if(sel) {
			sidebar[selected.class_name].edit(sel);
		} else
			growl("Select a parent item first.  Your new item will be place under this parent");
	},
	'click button.btn.btn-warning.btn-sm': function(e) {
		$(e.currentTarget).blur();
		var selected = getSelectedTreeItem();
		var _id = selected._id;
		if(!_id) { growl("Select an item first"); return false; }
		if (selected.type !== 'root')
			sidebar[selected.class_name].edit(_id);
		else
			growl("Cannot edit this item");
	},
	'click button.btn.btn-danger.btn-sm': function(e) {
		$(e.currentTarget).blur();
		var selected = getSelectedTreeItem();
		var _id = selected._id;
		if(!_id) { growl("Select an item first"); return false; }
		if (selected.type !== 'root' && selected.type !== 'top') {
			sidebar[selected.class_name].delete_node(_id);
		} else {
			growl("Cannot delete this item");
		}
	},
	'click #btn-open-all': function(e) {
		$(e.currentTarget).blur();
		var selected = getSelectedTreeItem();
		var _id = selected._id;
		if(!_id) { growl("Select an item first"); return false; }
		sidebar[selected.class_name].open_all();
	},
	'click #btn-close-all': function(e) {
		$(e.currentTarget).blur();
		var selected = getSelectedTreeItem();
		var _id = selected._id;
		if(!_id) { growl("Select an item first"); return false; }
		sidebar[selected.class_name].close_all();
//	},
//	'click #sidebar_left': function() {
//		var nbr = Session.get('sidebar_nbr');
//		if (nbr > 2)
//			Session.set('sidebar_nbr', (nbr-1) );
//	},
//	'click #sidebar_right': function() {
//		var nbr = Session.get('sidebar_nbr');
//		if (nbr < 10)
//			Session.set('sidebar_nbr', (nbr+1) );
	}

});

Template.tmpl_sidebar_buttons.rendered = function() {
	openAccordian();
};

// FUNCTIONS and VAR --------------------------------------------------------------------
var openAccordian = function(openMe) {
	if (openMe){ accordian.open = openMe; }

	if (accordian.open) {
		accordian.ids.forEach(function(id){
			if (id === accordian.open)
				$('#'+id).collapse('show');
			else
				$('#'+id).collapse('hide');
		});
	}
};
openAccordianOfSelected = function(noun) {
	var area_code = noun.area_code;
	if (area_code && accordian.open.substring(0,1)!==area_code){
		switch(area_code) {
			case 'a': return openAccordian('appLayer');
			case 'b': return openAccordian('busLayer');
			case 't': return openAccordian('techLayer');
			case 'm': return openAccordian('modvLayer');
			case 'i': return openAccordian('implLayer');
			case 'c': return openAccordian('comLayer');
		}
	}
};