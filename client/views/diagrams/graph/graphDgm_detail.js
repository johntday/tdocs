Template.tmpl_graphDgm_detail.helpers({
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_detail.events({
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_detail.rendered = function() {
	Session.set('has_sidebar', false);

	var graph = new joint.dia.Graph;

	// Create a paper and wrap it in a PaperScroller.
	// ----------------------------------------------

	var paperScroller = new joint.ui.PaperScroller({
		autoResizePaper: true
	});

	var paper = new joint.dia.Paper({
		el: paperScroller.el,
		width: 600,
		height: 500,
		gridSize: 10,
		perpendicularLinks: true,
		model: graph
	});
	paperScroller.options.paper = paper;

	$('#paper').append(paperScroller.render().el);

	paperScroller.center();

	var rect = new joint.shapes.basic.Rect({
		position: { x: 100, y: 30 },
		size: { width: 100, height: 30 },
		attrs: { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' } }
	});

	var rect2 = rect.clone();
	rect2.translate(300);

	var link = new joint.dia.Link({
		source: { id: rect.id },
		target: { id: rect2.id }
	});

	graph.addCells([rect, rect2, link]);


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


