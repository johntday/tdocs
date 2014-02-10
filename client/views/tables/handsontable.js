Template.handsontable.helpers({
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.handsontable.events({
	'click #btn-max-table': function (e) {
		Template.handsontable.maxed = !Template.handsontable.maxed;
		$(e.currentTarget).html( Template.handsontable.maxed ? 'Minimize' : 'Maximize' );
		Template.handsontable.table.render();
	},
	'click #btn-table-help': function () {
		bootbox.dialog({
			title: "Table Help",
			message: "<h3>Keys</h3><ul><li><b>CTRL+Z</b> undo</li><li><b>CTRL+Y</b> redo</li><li><b>F2</b> edit cell</li>" +
				"<li><b>ENTER</b> edit/save changes to cell</li>" +
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
	},
	'click #btn-table-save': function (e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to create a table');
			$(e.target).removeClass('disabled');
			return false;
		}

		// CREATE OBJECT
		var properties = {
			title: "test"
			, data: Template['handsontable'].table.getData()
			, colHeaders: Template['handsontable'].table.getColHeader()
		};

		// VALIDATE
		var isInputError = validateTable(properties);
		if (isInputError) {
			$(e.target).removeClass('disabled');
			return false;
		}

		// TRANSFORM AND DEFAULTS
		transformTable(properties);

		Meteor.call('createTable', properties, function(error, table) {
			if(error){
				console.log(JSON.stringify(error));
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				Router.go('/tables/'+table.tableId);
			}
		});
	}

});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.handsontable.rendered = function() {

	var data = this.data.data || [];
	var colHeaders = this.data.colHeaders || ['A','B','C'];

	var $example1 = $('#test');
	var settings = tableSettings(
		"handsontable",
		$example1,
		{data:data
		, colHeaders: colHeaders
		}
	);

	if (Template.handsontable.table) {
		Template.handsontable.table.updateSettings(settings);
	} else {
		Template.handsontable.table = new Handsontable.Core( $example1, settings );
		Template.handsontable.table.init();
	}

};
