var resizeTimeout
	, availableWidth
	, availableHeight
	, $window = $(window)
	, lastChange;

var calculateSize = function ($example1) {
	var offset = $example1.offset();
	availableWidth = $window.width() - offset.left + $window.scrollLeft() - 50;
	availableHeight = $window.height() - offset.top + $window.scrollTop() - 40;
};
var setDirty = function(templateName) {
	//console.log( 'Template[templateName].dirty='+Template[templateName].dirty);
	if ( !Template[templateName].dirty ) {
		$('#btn-table-save').removeClass('disabled');
		Template[templateName].dirty = true;
	}
};

//$window.on('resize', calculateSize);


tableSettings = function(templateName, $example1, settings) {
	var table_width = settings.table_width || 400;
	var table_height = settings.table_height || 300;

	return _.extend( {
		//data: data,
		//colWidths: [55, 47, 47, 47, 47, 47, 47], //can also be a number or a function
		rowHeaders: false,
		//colHeaders: ["", "Maserati", "Mazda", "Mercedes", "Mini", "Mitsubishi"],
		fixedRowsTop: 1,
		columnSorting: true,
		scrollH: 'auto',
		scrollV: 'auto',
		stretchH: 'all',//'hybrid', //default
		minSpareRows: 1,
		contextMenu: {
			callback: function (key, options) {
				if (key === 'change_header') {
					//var header_name = prompt("Enter new header name");
					bootbox.prompt("Enter new header name", function(result) {
						if ( result ) {
							var col = options.start._col;
							settings.colHeaders[col] = result;
							//setDirty(templateName);
							Template[templateName].table.render();
						}
					});
				} else if (key === 'add_list' || key === 'add_link') {
					bootbox.dialog({
						title: "Sorry",
						message: "Not ready yet",
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
				"hsep4": "---------",
				"change_header": {name: 'Change header name'},
				"hsep5": "---------",
				"add_link": {name: 'Add a link'},
				"add_list": {name: 'Add a list'}
			}
		},
		fillHandle: true,

//		beforeChange: function (changes, source) {
//			lastChange = changes;
//		},
		beforeKeyDown: function (e) {
//			var HOT = Template[templateName].table
//				, selection = HOT.getSelected();
//
//			if (e.keyCode === 13) { //ENTER
//				if (lastChange && lastChange.length === 1 && lastChange[0][2] == lastChange[0][3]) { //if last change affected a single cell and did not change it's values
//					//e.stopImmediatePropagation();
//				} else {
//					setDirty(templateName);
//				}
//			} else
//			if (e.keyCode !== 27) {
//				setDirty(templateName);
//				//console.log(e.keyCode);
//			}

			lastChange = null;
		},

		width: function () {
			if (Template[templateName].maxed && availableWidth === void 0) {
				calculateSize($example1);
			}
			return Template[templateName].maxed ? availableWidth : table_width;
		},
		height: function () {
			if (Template[templateName].maxed && availableHeight === void 0) {
				calculateSize($example1);
			}
			return Template[templateName].maxed ? availableHeight : table_height;
		}
	},
		settings)
};