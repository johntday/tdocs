Template.tmpl_graphDgm_detail.helpers({
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_detail.events({
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_detail.rendered = function() {
	resizePaper();
	Session.set('has_sidebar', false);

	//Template['tmpl_graphDgm_detail'].

	var graph = new joint.dia.Graph;

	// Create a paper and wrap it in a PaperScroller.
	// ----------------------------------------------

	var paperScroller = new joint.ui.PaperScroller({
		autoResizePaper: true
	});

	var paper = new joint.dia.Paper({
		el: paperScroller.el,
		width: 500,
		height: 500,
		gridSize: 10,
		perpendicularLinks: true,
		model: graph
	});
	paperScroller.options.paper = paper;

	$('#paper').append(paperScroller.render().el);

	paperScroller.center();

	var stencil = new joint.ui.Stencil({
		graph: graph
		,paper: paper
		,width: 200
		,height: 450
		,groups: {
			simple: { label: 'Simple', index: 1, closed: false }
			//,custom: { label: 'Custom', index: 2, closed: true }
		}
	});
	$('#stencil').append(stencil.render().el);


	var r = new joint.shapes.basic.Rect({
		position: { x: 60, y: 20 },
		size: { width: 100, height: 60 },
		attrs: {
			rect: { rx: 2, ry: 2, width: 50, height: 30, fill: '#27AE60' },
			text: { text: 'rect', fill: 'white', 'font-size': 10 }
		}
	});
	var c = new joint.shapes.basic.Circle({
		position: { x: 60, y: 100 },
		size: { width: 100, height: 60 },
		attrs: {
			circle: { width: 50, height: 30, fill: '#E74C3C' },
			text: { text: 'ellipse', fill: 'white', 'font-size': 10 }
		}
	});

	stencil.load([r,c], 'simple');


	// Selection.
	// ----------

	var selection = new Backbone.Collection;

	var selectionView = new joint.ui.SelectionView({
		paper: paper,
		graph: graph,
		model: selection
	});


	// Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
	// Otherwise, initiate paper pan.
	paper.on('blank:pointerdown', function(evt, x, y) {

		if (_.contains(KeyboardJS.activeKeys(), 'shift')) {
			selectionView.startSelecting(evt, x, y);
		} else {
			paperScroller.startPanning(evt, x, y);
		}
	});

	paper.on('cell:pointerdown', function(cellView, evt) {
		// Select an element if CTRL/Meta key is pressed while the element is clicked.
		if ((evt.ctrlKey || evt.metaKey) && !(cellView.model instanceof joint.dia.Link)) {
			selectionView.createSelectionBox(cellView);
			selection.add(cellView.model);
		}
	});

	selectionView.on('selection-box:pointerdown', function(evt) {
		// Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
		if (evt.ctrlKey || evt.metaKey) {
			var cell = selection.get($(evt.target).data('model'));
			selectionView.destroySelectionBox(paper.findViewByModel(cell));
			selection.reset(selection.without(cell));
		}
	});

	// Disable context menu inside the paper.
	// This prevents from context menu being shown when selecting individual elements with Ctrl in OS X.
	paper.el.oncontextmenu = function(evt) { evt.preventDefault(); };

	// enable link inspector
	paper.on('link:options', function(evt, cellView, x, y) {
		// Here you can create an inspector for the link the same way as it is done for normal elements.
		console.log('link inspector');
	});

	// An example of a simple element editor.
	// --------------------------------------

	//var elementInspector = new ElementInspector();
	//$('.inspector').append(elementInspector.el);

	// Halo - element tools.
	// ---------------------

	paper.on('cell:pointerup', function(cellView, evt) {

		if (cellView.model instanceof joint.dia.Link || selection.contains(cellView.model)) return;

		var halo = new joint.ui.Halo({
			graph: graph,
			paper: paper,
			cellView: cellView,
			linkAttributes: {
				'.marker-source': { d: 'M 10 0 L 0 5 L 10 10 z', transform: 'scale(0.001)' },
				// @TODO: scale(0) fails in Firefox
				'.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
			}
		});

		halo.render();
		//createInspector(cellView);
	});


	// Command Manager - undo/redo.
	// ----------------------------

	var commandManager = new joint.dia.CommandManager({ graph: graph });

	// Validator
	// ---------
	// nothing

	// Hook on toolbar buttons.
	// ------------------------

	$('#btn-undo').on('click', _.bind(commandManager.undo, commandManager));
	$('#btn-redo').on('click', _.bind(commandManager.redo, commandManager));
	$('#btn-clear').on('click', _.bind(graph.clear, graph));
	$('#btn-svg').on('click', function() {
		paper.openAsSVG();
		console.log(paper.toSVG()); // An exmaple of retriving the paper SVG as a string.
	});
	$('#btn-find-element, #btn-layout, #btn-group, #btn-ungroup').on('click', function() {
		alert('not ready yet');
	});
	$('#btn-center-content').click(function(){
		paperScroller.centerContent();
	});

	var zoomLevel = 1;

	function zoom(paper, newZoomLevel) {

		if (newZoomLevel > 0.2 && newZoomLevel < 20) {

			var ox = (paper.el.scrollLeft + paper.el.clientWidth / 2) / zoomLevel;
			var oy = (paper.el.scrollTop + paper.el.clientHeight / 2) / zoomLevel;

			paper.scale(newZoomLevel, newZoomLevel, ox, oy);

			zoomLevel = newZoomLevel;
		}
	}

	$('#btn-zoom-in').on('click', function() { zoom(paper, zoomLevel + 0.2); });
	$('#btn-zoom-out').on('click', function() { zoom(paper, zoomLevel - 0.2); });

};
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_detail.created = function() {
};
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_detail.destroyed = function() {

};

function resizePaper() {
	var w = $(window).width();
	var h = $(window).height();

	var $paper = $( '#paper' );
	var $stencil = $( '#stencil' );
	//console.log( 'stencil offset left '+$stencil.offset().left);

	var css = {
		position: 'absolute'
		,top: '40px'
		,left: '241px'
		,right: '241px'
		,width:  (w - $stencil.offset().left - 240) + 'px'
		,height: (h - $stencil.offset().top -   40) + 'px'
		,bottom: 0
		,overflow: 'hidden'
		,'background-color': 'hsla(220,11%,97%,.95)'
	};

	$paper.css(css);
}