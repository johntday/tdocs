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
		alert('show help');
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

		var resizeTimeout
			, availableWidth
			, availableHeight
			, $window = $(window)
			, $example1 = $('#test')
			, table_width = 400
			, table_height = 300;

	var calculateSize = function () {
		var offset = $example1.offset();
		availableWidth = $window.width() - offset.left + $window.scrollLeft() - 50;
		availableHeight = $window.height() - offset.top + $window.scrollTop() - 40;
	};
	$window.on('resize', calculateSize);

	var settings = {
		data: data,
		//colWidths: [55, 47, 47, 47, 47, 47, 47], //can also be a number or a function
		rowHeaders: false,
		colHeaders: ["", "Maserati", "Mazda", "Mercedes", "Mini", "Mitsubishi"],
		fixedRowsTop: 1,
		columnSorting: true,
//		currentRowClassName: 'currentRow',
//		currentColClassName: 'currentCol',
//		autoWrapRow: true,
		scrollH: 'auto',
		scrollV: 'auto',
		stretchH: 'all',//'hybrid', //default
		minSpareRows: 1,
		contextMenu: {
			callback: function (key, options) {
				if (key === 'change_header') {
					var header_name = prompt("Enter new header name");
					var col = options.start._col;
					settings.colHeaders[col] = header_name;
					Template.test.table.render();
				}
			},
			items: {
				"row_above": {},
				"row_below": {},
				"hsep1": "---------",
				"col_left": {},
				"col_right": {},
				"hsep2": "---------",
				"remove_row": {},
				"remove_col": {},
				"hsep3": "---------",
				"undo": {},
				"redo": {},
				"change_header": {name: 'Change header name'}
			}
		},
		fillHandle: true,
		width: function () {
			if (Template.test.maxed && availableWidth === void 0) {
				calculateSize();
			}
			return Template.test.maxed ? availableWidth : table_width;
		},
		height: function () {
			if (Template.test.maxed && availableHeight === void 0) {
				calculateSize();
			}
			return Template.test.maxed ? availableHeight : table_height;
		}
//		cells: function (row, col, prop) {
//			var cellProperties = {};
//			if (row === 0) {
//				cellProperties.renderer = "firstRowRenderer";
//				//cellProperties.readOnly = true;
//			}
//			else
//				cellProperties.renderer = "defaultValueRenderer";
//			return cellProperties;
//		}
	};

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
