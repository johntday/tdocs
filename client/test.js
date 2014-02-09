Template.test.helpers({
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.test.events({
	'click .maximize': function () {
		Template.test.maxed = !Template.test.maxed;
		Template.test.table.render();
		console.log('maxed='+Template.test.maxed);
	}

});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.test.rendered = function() {

	var data = [
		["", "Maserati", "Mazda", "Mercedes", "Mini", "Mitsubishi"],
		["2009", 0, 2941, 4303, 354, 5814],
		["2010", 5, 2905, 2867, 412, 5284],
		["2011", 4, 2517, 4822, 552, 6127],
		["2012", 2, 2422, 5399, 776, 4151]
	];

	data = createBigData();

		var resizeTimeout
		, availableWidth
		, availableHeight
		, $window = $(window)
		, $example1 = $('#test');

	var calculateSize = function () {
		var offset = $example1.offset();
		availableWidth = $window.width() - offset.left + $window.scrollLeft() - 50;
		availableHeight = $window.height() - offset.top + $window.scrollTop() - 40;
	};
	$window.on('resize', calculateSize);

	var settings = 			{
		data: data,
		//colWidths: [55, 47, 47, 47, 47, 47, 47], //can also be a number or a function
		//fixedRowsTop: 1,
		rowHeaders: true,
		colHeaders: true,
		scrollH: 'auto',
		scrollV: 'auto',
		stretchH: 'all',//'hybrid', //default
		minSpareRows: 1,
		contextMenu: true,
		width: function () {
			if (Template.test.maxed && availableWidth === void 0) {
				calculateSize();
			}
			return Template.test.maxed ? availableWidth : 400;
		},
		height: function () {
			if (Template.test.maxed && availableHeight === void 0) {
				calculateSize();
			}
			return Template.test.maxed ? availableHeight : 300;
		}
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
