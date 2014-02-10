Template.test.helpers({
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.test.events({
	'click #btn-max-table': function (e) {
		Template.test.maxed = !Template.test.maxed;
		$(e.currentTarget).html( Template.test.maxed ? 'Minimize' : 'Maximize' );
		Template.test.table.render();
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
		// DO SAVE
		//$(e.currentTarget).addClass("disabled");
		//Template.test.dirty = false;
	}

});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.test.rendered = function() {

	var data = [
//		["", "Maserati", "Mazda", "Mercedes", "Mini", "Mitsubishi"],
		["2009", 0, 2941, 4303, 354, 5814],
		["2010", 5, 2905, 2867, 412, 5284],
		["2011", 4, 2517, 4822, 552, 6127],
		["2012", 2, 2422, 5399, 776, 4151]
	];

	//data = createBigData();

//		var resizeTimeout
//			, availableWidth
//			, availableHeight
//			, $window = $(window)
//			, $example1 = $('#test')
//			, table_width = 400
//			, table_height = 300;
//
//	var calculateSize = function () {
//		var offset = $example1.offset();
//		availableWidth = $window.width() - offset.left + $window.scrollLeft() - 50;
//		availableHeight = $window.height() - offset.top + $window.scrollTop() - 40;
//	};
//	$window.on('resize', calculateSize);
	var $example1 = $('#test');
	var settings = tableSettings(
		"test",
		$example1,
		{data:data
		, colHeaders: ["", "Maserati", "Mazda", "Mercedes", "Mini", "Mitsubishi"]
		}
	);

//	var settings = {
//		data: data,
//		//colWidths: [55, 47, 47, 47, 47, 47, 47], //can also be a number or a function
//		rowHeaders: false,
//		colHeaders: ["", "Maserati", "Mazda", "Mercedes", "Mini", "Mitsubishi"],
//		fixedRowsTop: 1,
//		columnSorting: true,
////		currentRowClassName: 'currentRow',
////		currentColClassName: 'currentCol',
////		autoWrapRow: true,
//		scrollH: 'auto',
//		scrollV: 'auto',
//		stretchH: 'all',//'hybrid', //default
//		minSpareRows: 1,
//		contextMenu: {
//			callback: function (key, options) {
//				if (key === 'change_header') {
//					//var header_name = prompt("Enter new header name");
//					bootbox.prompt("Enter new header name", function(result) {
//						if ( result ) {
//							var col = options.start._col;
//							settings.colHeaders[col] = result;
//							Template.test.table.render();
//						}
//					});
//				} else if (key === 'add_list' || key === 'add_link') {
//					bootbox.dialog({
//						title: "Sorry",
//						message: "Not ready yet",
//						buttons: {
//							main: {
//								label: "OK",
//								className: "btn-primary",
//								callback: function() {
//								}
//							}
//						}
//					});
//				}
//			},
//			items: {
//				"row_above": {},
//				"row_below": {},
//				"hsep1": "---------",
//				"col_left": {},
//				"col_right": {},
//				"hsep2": "---------",
//				"remove_row": {},
//				"remove_col": {},
//				"hsep3": "---------",
//				"undo": {},
//				"redo": {},
//				"hsep4": "---------",
//				"change_header": {name: 'Change header name'},
//				"hsep5": "---------",
//				"add_link": {name: 'Add a link'},
//				"add_list": {name: 'Add a list'}
//			}
//		},
//		fillHandle: true,
//		width: function () {
//			if (Template.test.maxed && availableWidth === void 0) {
//				calculateSize();
//			}
//			return Template.test.maxed ? availableWidth : table_width;
//		},
//		height: function () {
//			if (Template.test.maxed && availableHeight === void 0) {
//				calculateSize();
//			}
//			return Template.test.maxed ? availableHeight : table_height;
//		}
////		cells: function (row, col, prop) {
////			var cellProperties = {};
////			if (row === 0) {
////				cellProperties.renderer = "firstRowRenderer";
////				//cellProperties.readOnly = true;
////			}
////			else
////				cellProperties.renderer = "defaultValueRenderer";
////			return cellProperties;
////		}
//	};

	if (Template.test.table) {
		Template.test.table.updateSettings(settings);
	} else {
		Template.test.table = new Handsontable.Core( $example1, settings );
		Template.test.table.init();
	}


	function createBigData() {
		var rows = []
			, i
			, j;

		for (i = 0; i < 100; i++) {
			var row = [];
			for (j = 0; j < 16; j++) {
				row.push( 'Cell '+i+' '+j);
			}
			rows.push(row);
		}

		return rows;
	}

};
