Template.tmpl_table_detail.helpers({
	isAdmin: function() {
		return isAdmin();
	},
	breadcrumbs: function() {
		Meteor.MyClientModule.scrollToTopOfPageFast();
		return Session.get("breadcrumbs");
	},
	showEditButton: function() {
		return showEditButton(this);
	},
	canEditAndEditToggle: function() {
		return canEditAndEditToggle(this);
	},
	isAdminAndEditToggle: function() {
		return isAdminAndEditToggle();
	},
	createdAgo: function() {
		return dateAgo(this.created);
	},
	updatedAgo: function() {
		return dateAgo(this.updated);
	},
	statusOptions: function() {
		return getTableStatusOptions();
	},
	isFav: function() {
		return isFav(this.favs);
	},
	hasSeen: function() {
		return hasSeen(this.seen);
	},
	isStar: function() {
		return isStar(this.stars);
	},
	click_cnt: function() {
		return (this.click_cnt) ? this.click_cnt : 0;
	},
	favs_cnt: function() {
		return (this.favs_cnt && this.favs_cnt > -1) ? this.favs_cnt : 0;
	},
	seen_cnt: function() {
		return (this.seen_cnt && this.seen_cnt > -1) ? this.seen_cnt : 0;
	},
	stars_cnt: function() {
		return (this.stars_cnt && this.stars_cnt > -1) ? this.stars_cnt : 0;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_table_detail.events({
	'click #btnEditToggle': function(e) {
		e.preventDefault();
		Session.set('form_update', true);
	},

	'click #btnCancelTable': function(e) {
		e.preventDefault();
		Template['tmpl_table_detail'].table.PluginHooks.run('persistentStateReset');
		Session.set('form_update', false);
	},

	'click #btnDeleteTable': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to delete a table');
			$(e.target).removeClass('disabled');
			return false;
		}

		Meteor.call('deleteTable', this._id, function(error) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				growl( "Table deleted", {type:'s', hideSnark:true} );
				Router.go('/tables');
			}
		});
	},

	'click #icon-heart': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a table to your favorities');
			return false;
		}

		if ( isFav(this.favs) ) {
			Tables.update(this._id,
				{
					$pull: { favs: user._id },
					$inc: { favs_cnt: -1 }
				}
			);
			MyLog("table_details.js/click #icon-heart/1", "remove from favs");
		} else {
			Tables.update(this._id,
				{
					$addToSet: { favs: user._id },
					$inc: { favs_cnt: 1 }
				}
			);
			MyLog("table_details.js/click #icon-heart/1", "add to favs");
		}
	},

	'click #icon-eye': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a table to your "seen it" list');
			return false;
		}

		if ( hasSeen(this.seen) ) {
			Tables.update(this._id, { $pull: { seen: user._id }, $inc: { seen_cnt: -1 } } );
			MyLog("table_details.js/click #icon-eye/2", "remove from seen");
		} else {
			Tables.update(this._id, { $addToSet: { seen: user._id }, $inc: { seen_cnt: 1 } } );
			MyLog("table_details.js/click #icon-eye/1", "remove from seen");
		}
	},

	'click #icon-star': function(e) {
		var user = Meteor.user();
		if(!user){
			throwError('You must login to add a table to your "star" list');
			return false;
		}

		if ( isStar(this.stars) ) {
			Tables.update(this._id, { $pull: { stars: user._id }, $inc: { stars_cnt: -1 } } );
			MyLog("table_details.js/click #icon-star/2", "remove from stars");
		} else {
			Tables.update(this._id, { $addToSet: { stars: user._id }, $inc: { stars_cnt: 1 } } );
			MyLog("table_details.js/click #icon-star/1", "remove from stars");
		}
	},

	'keyup #description, focus #description': function(e) {
		e.preventDefault();
		var $element = $(e.target).get(0);
		$element.style.overflow = 'hidden';
		$element.style.height = 0;
		$element.style.height = $element.scrollHeight + 'px';
	},

	'click #btnUpdateTable': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to update a table');
			$(e.target).removeClass('disabled');
			return false;
		}

		// GET INPUT
		var _id = this._id;

		var properties = {
			type: TYPES.table
			, title: $('#title').val()
			, description: $('#description').val()
			, data: Template['tmpl_table_detail'].table.getData()
			, colHeaders: Template['tmpl_table_detail'].table.getColHeader()
		};

		if ( isAdmin(Meteor.user()) ) {
			_.extend(properties, {
				status: $('#status').val()
			});
		}

		// VALIDATE
		var isInputError = validateTable(properties);
		if (isInputError) {
			$(e.target).removeClass('disabled');
			return false;
		}

		// TRANSFORM AND DEFAULTS
		transformTable(properties);

		Meteor.call('updateTable', _id, properties, function(error, table) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				growl( "Table updated", {type:'s', hideSnark:true} );
				MyLog("table_details.js/1", "updated table", {'_id': _id, 'table': table});
				//Router.go('/tables');
			}
		});
	},
	'click #btn-max-table': function (e) {
		Template['tmpl_table_detail'].maxed = !Template['tmpl_table_detail'].maxed;
		$(e.currentTarget).html( Template['tmpl_table_detail'].maxed ? 'Minimize Table' : 'Maximize Table' );
		Template['tmpl_table_detail'].table.render();
	},
	'click #btn-table-help': function () {
		bootbox.dialog({
			title: "Table Help",
			message: "Works similar to Microsoft Excel"+
				"<h3>Keys</h3><ul><li><b>CTRL+Z</b> undo</li><li><b>CTRL+Y</b> redo</li><li><b>F2</b> edit cell</li>" +
				"<li><b>ENTER</b> edit/save changes to cell</li>" +
				"</ul>" +
				"<h3>General</h3><ul><li><b>Sorting</b> Click on header column to sort</li>" +
				"<li><b>Column Resize</b> RIGHT part of column header has a draggable column resize handle.  Double click on the column resize handle to automatically adjust column width.</li>" +
				"<li><b>Column Move</b> LEFT part of column header has a draggable column MOVE handle</li>" +
				"</ul>" +
				"<h3>Right click on table for context Menu</h3><ul>" +
				"<li><b>Insert Row</b></li>" +
				"<li><b>Remove Row</b></li>" +
				"<li><b>Insert Column</b></li>" +
				"<li><b>Remove Row</b></li>" +
				"<li><b>Undo</b></li>" +
				"<li><b>Redo</b></li>" +
				"<li><b>Change Header Name</b></li>" +
				"</ul>",
			buttons: {
				main: {
					label: "OK",
					className: "btn-primary",
					callback: function() {
					}
				}
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_table_detail.rendered = function() {
	var default_data = [["", "", ""],["", "", ""],["", "", ""]];
	var default_colHeaders = ["A", "B", "C"];
	var data = this.data.data || default_data;
	var colHeaders = this.data.colHeaders || default_colHeaders;
	var $example1 = $('#test');
	var settings = tableSettings(
		"tmpl_table_detail",
		canEditAndEditToggle(this.data),
		$example1,
		{data:data
			, colHeaders: colHeaders
		}
	);

	if ( Template['tmpl_table_detail'].table ) {
		Template['tmpl_table_detail'].table.updateSettings(settings);
		Template['tmpl_table_detail'].table.render();
	} else {
		Template['tmpl_table_detail'].table = new Handsontable.Core( $example1, settings );
		Template['tmpl_table_detail'].table.init();
	}

	$("#title").focus();
	$("#description").focus();
	if ( !Session.get('form_update') )
		$("#description").blur();
	else
		Template['tmpl_table_detail'].table.selectCell(0, 0);
};
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_table_detail.destroyed = function() {
	incClickCnt(Tables, this.data._id);
	Template['tmpl_table_detail'].table = null;
	Template['tmpl_table_detail'].isFirst = null;
};
