Template.tmpl_graphDgm_detail.helpers({
	canEdit: function() {
		return canEdit(Meteor.user(), this);
	},
	breadcrumbs: function() {
		Meteor.MyClientModule.scrollToTopOfPageFast();
		return Session.get("breadcrumbs");
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_detail.events({
	'click #btn-delete-graph': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to delete a diagram');
			$(e.target).removeClass('disabled');
			return false;
		}

		Meteor.call('deleteDiagram', this._id, function(error) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				growl( "Diagram deleted", {type:'s', hideSnark:true} );
				Router.go('/diagrams');
			}
		});
	},

	'click #btn-save': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		if(!Meteor.user()){
			throwError('You must login to update a diagram');
			$(e.target).removeClass('disabled');
			return false;
		}

		// GET INPUT
		var _id = this._id;
		var code = JSON.stringify(Template['tmpl_graphDgm_detail'].graph.toJSON());

//		if ( isAdmin(Meteor.user()) ) {
//			_.extend(properties, {
//				status: $('#status').val()
//			});
//		}

		// VALIDATE AND TRANSFORM
//		var isInputError = validateGraph(properties);
//		if (isInputError) {
//			$(e.target).removeClass('disabled');
//			return false;
//		}
//		transformGraph(properties);

		Meteor.call('updateDiagramCode', _id, code, function(error, diagram) {
			if(error){
				MyLog("diagram_details.js/1", "updated diagram", {'error': error, 'diagram': diagram});
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				Session.set('form_update', false);
				growl( "Diagram updated", {type:'s', hideSnark:true} );
				MyLog("diagram_details.js/1", "updated diagram", {'_id': _id, 'diagram': diagram});
			}
		});
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_detail.rendered = function() {
	console.log( !!Template['tmpl_graphDgm_detail'].graph );
	if (Template['tmpl_graphDgm_detail'].graph) {
		console.log('i');
		return;
	}
	resizePaper();
	Session.set('has_sidebar', false);

	Template['tmpl_graphDgm_detail'].graph = new joint.dia.Graph;
	console.log( this.data.code );
	if (this.data.code)
		Template['tmpl_graphDgm_detail'].graph.fromJSON( JSON.parse(this.data.code) );

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
		model: Template['tmpl_graphDgm_detail'].graph
	});
	paperScroller.options.paper = paper;

	$('#paper').append(paperScroller.render().el);

	paperScroller.center();

	var stencil = new joint.ui.Stencil({
		graph: Template['tmpl_graphDgm_detail'].graph
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
		graph: Template['tmpl_graphDgm_detail'].graph,
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
			graph: Template['tmpl_graphDgm_detail'].graph,
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

	var commandManager = new joint.dia.CommandManager({ graph: Template['tmpl_graphDgm_detail'].graph});

	// Validator
	// ---------
	// nothing

	// Hook on toolbar buttons.
	// ------------------------

	$('#btn-undo').on('click', _.bind(commandManager.undo, commandManager));
	$('#btn-redo').on('click', _.bind(commandManager.redo, commandManager));
	$('#btn-clear').on('click', _.bind(Template['tmpl_graphDgm_detail'].graph.clear, Template['tmpl_graphDgm_detail'].graph));
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
	Template['tmpl_graphDgm_detail'].graph = null;
	incClickCnt(Diagrams, this.data._id);
};

function resizePaper() {
	var w = $(window).width();
	var h = $(window).height();

	var $paper = $( '#paper' );
	var $stencil = $( '#stencil' );
	//console.log( 'stencil offset left '+$stencil.offset().left);

	var top = 90;
	var css = {
		position: 'absolute'
		,top: top+'px'
		,left: '241px'
		,right: '241px'
		,width:  (w - $stencil.offset().left - 240) + 'px'
		,height: (h - $stencil.offset().top -   50) + 'px'
		,bottom: 0
		,overflow: 'hidden'
		,'background-color': 'hsla(220,11%,97%,.95)'
	};

	$paper.css(css);
}

function updateTitleDescription() {
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