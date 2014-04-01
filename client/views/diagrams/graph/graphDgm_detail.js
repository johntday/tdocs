Template.tmpl_graphDgm_detail.helpers({
	canEdit: function() {
		return canEdit(Meteor.user(), this);
	},
	breadcrumbs: function() {
		Meteor.MyClientModule.scrollToTopOfPageFast();
		//console.log( Session.get("breadcrumbs") );
		return Session.get("breadcrumbs");
	},
	changeTitle: function() {
		return '';
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_detail.events({
	'click #btn-graph-help': function() {
		bootbox.dialog({
			title: "Graph Diagram Help"
			,message:
				"<h3>Buttons</h3>" +
				"<ul>" +
				"<li><b>Help</b> Click on header column to sort</li>" +
				"<li><b>Save</b> Save diagram</li>" +
				"<li><b>undo</b> Undo last change</li>" +
				"<li><b>redo</b> Redo last change</li>" +
				"<li><b>clear</b> Clear - remove all stuff and start with an clean paper</li>" +
				"<li><b>picturize</b> Opens diagram as a picture in another window.  Useful to save your diagram and use somewhere else</li>" +
				"<li><b>zoom in</b> Zooms in</li>" +
				"<li><b>zoom out</b> Zooms out</li>" +
				"<li><b>find</b> Search for elements by text</li>" +
				"<li><b>center</b> Centers the diagram content</li>" +
				"<li><b>layout</b> Layout the diagram elements</li>" +
				"<li><b>Delete</b> Deletes your diagram</li>" +
				"<li><b>Exit</b> Leave diagram</li>" +
				"</ul>" +
				"<h3>Actions</h3>" +
				"<ul>" +
				'<li><b>Add Element</b> Click on element in left-panel, and select <button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-arrow-right"></span> </button></li>' +
				"<li><b>Drag Paper</b> Click on paper to drag and move paper (background)</li>" +
				"<li><b>Selecting More Than One Element</b> Hold down SHIFT-key while you click and move mouse to select multiple elements</li>" +
				"<li><b>Selecting One at a Time</b> Hold down CTRL-key while clicking on elements to select</li>" +
				"<li><b>Moving Elements</b> After you select the elements you want to move, just drag them</li>" +
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
	'click div.toolbar .not-yet': function() {
		bootbox.dialog({
			title: "Sorry",
			message: "Function not available yet",
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
	'click #btn-delete-graph': function(e) {
		e.preventDefault();
		bootbox.dialog({
			title: "Delete Diagram"
			,message:'You sure about this?'
			,buttons: {
				delete: {
					label: "Delete",
					className: "btn-danger",
					callback: function() {
						deleteGraph(data._id);
					}
				},
				cancel: {
					label: "Cancel",
					className: "btn-default",
					callback: function() {
					}
				}
			}
			,onEscape: function() {
			}
		});
	},
	'click #btn-exit': function(e) {
		e.preventDefault();
		bootbox.dialog({
			title: "Exit Diagram"
			,message:'Do you want to SAVE first?'
			,buttons: {
				save: {
					label: "Yes, SAVE before Exiting",
					className: "btn-primary",
					callback: function() {
						saveGraph();
						Router.go('/diagrams');
					}
				},
				leave: {
					label: "No, just Exit",
					className: "btn-danger",
					callback: function() {
						Router.go('/diagrams');
					}
				},
				cancel: {
					label: "Cancel",
					className: "btn-default",
					callback: function() {
					}
				}
			}
			,onEscape: function() {
			}
		});
	},
	'click #btn-save': function(e) {
		e.preventDefault();
		saveGraph();
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_detail.rendered = function() {
	data = this.data;
	Session.set('sidebar_nbr',3);
	Session.set('has_sidebar', false);

	Template['tmpl_graphDgm_detail'].graph = new joint.dia.Graph;

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
		perpendicularLinks: false,
		model: Template['tmpl_graphDgm_detail'].graph
	});
	paperScroller.options.paper = paper;

	var $paper = $('#paper');
	$paper.append(paperScroller.render().el);

	paperScroller.center();

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
		bootbox.dialog({
			title: "Link Properties"
			,message:
				//Template.graphDgm_link_inspector({contextVar:'SomeValue'})
				'hello'
			,buttons: {
				success: {
					label: "OK",
					className: "btn-primary",
					callback: function() {
					}
				},
				cancel: {
					label: "Cancel",
					className: "btn-default",
					callback: function() {
					}
				}
			}
			,onEscape: function() {
			}
		});
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
	var validator = new joint.dia.LinkValidator({ commandManager: commandManager });

	validator.validate('change:target',
		function (err, command, next) {
			//console.log(command.data);
			var graph = Template['tmpl_graphDgm_detail'].graph;
			//console.log( graph.getLinks() );

			if (command.action === 'add' && command.batch) return next();

			var data = command.data;
			relationship_id = data.id;
			var link = graph.getCell( relationship_id );
			var source = graph.getCell( link.attributes.source.id );
			source_class_name = source.attributes.attrs.text.class_name;
			source_id = source.attributes.attrs.text._id;
			source_graph_id = source.id;
			var target = graph.getCell( data.next.target.id );
			// connected to target?
			if (!target){ return next('drag to another item to create relationship'); }
			target_class_name = target.attributes.attrs.text.class_name;
			target_id = target.attributes.attrs.text._id;
			target_graph_id = target.id;
			//console.log( source, target, source_class_name, target_class_name );

			// any relationships in model?
			if (!ea.hasRelationship(source_class_name, target_class_name, true)) {
				return next('No valid relationship exists between '+source_class_name+' and '+target_class_name); }

			// check for dup
			//TODO

			// get titles
			source_title = source.attributes.attrs.text.text.replace(/\n/g, '');
			target_title = target.attributes.attrs.text.text.replace(/\n/g, '');

			return true;
		}
	);

	validator.on('invalid',function(message) { growl(message); });

	validator.on('valid', function() {
		if (relationshipDialogOpen){ return; }
		relationshipDialogOpen = true;
		bootbox.dialog({
			title: "Pick a relationship type"
			,message:
				Template.graphDgm_pick_rel({source_class_name:source_class_name, target_class_name:target_class_name,
					source_title:source_title, target_title:target_title})
			,buttons: {
				success: {
					label: "Select",
					className: "btn-primary",
					callback: function() {
						relationshipDialogOpen = false;
						// ADD RELATIONSHIP
						var rel_name = $( "input:checked").val();
						var _id = createRelationship(source_id, target_id, rel_name);
						if (!_id){ return; }
						// REMOVE LINE
						commandManager.cancel();
						// ADD CORRECT LINE
						addRelToGraph(_id, rel_name, source_graph_id, target_graph_id);
					}
				},
				cancel: {
					label: "Cancel",
					className: "btn-default",
					callback: function() {
						relationshipDialogOpen = false;
						// CANCEL
						commandManager.cancel();
					}
				}
			}
			,onEscape: function() {
			}
		});
	});

//	Template['tmpl_graphDgm_detail'].graph.on('all', function(e) {
//		console.log(e);
//	});


	// Hook on toolbar buttons.
	// ------------------------
	$('#btn-undo').on('click', _.bind(commandManager.undo, commandManager));
	$('#btn-redo').on('click', _.bind(commandManager.redo, commandManager));
	$('#btn-clear').on('click', _.bind(Template['tmpl_graphDgm_detail'].graph.clear, Template['tmpl_graphDgm_detail'].graph));
	$('#btn-svg').on('click', function() {
		paper.openAsSVG();
		//console.log(paper.toSVG()); // An exmaple of retriving the paper SVG as a string.
	});
	$('#btn-center-content').click(function(){ paperScroller.centerContent(); });

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

	resizePaper($paper);

	if (data.code) {
		Template['tmpl_graphDgm_detail'].graph.fromJSON( JSON.parse(data.code) );
	}
};
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_detail.created = function() {
};
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_graphDgm_detail.destroyed = function() {
	Template['tmpl_graphDgm_detail'].graph = null;
	incClickCnt(Diagrams, data._id);
};
/*-------- FUNCTIONS AND VARS---------------------------------------------------------------------------------------------------*/
var data;
var relationship_id;
var relationshipDialogOpen = false;
var source_class_name, source_title, source_id, source_graph_id;
var target_class_name, target_title, target_id, target_graph_id;

function resizePaper($paper) {
	var w = $(window).width();
	var h = $(window).height();

	$paper.css({
		position: 'absolute'
		,top: '120px'
		,left: '20px'
		,right: '20px'
		,width:  (w - 490) + 'px'
		,height: (h -  190) + 'px'
		,bottom: 0
		,overflow: 'hidden'
		,'background-color': 'hsla(220,11%,97%,.95)'
	});
}

var createRelationship = function(source_id, target_id, rel_name) {
	var attrs = undefined;

	Meteor.call('createRelationship', getProjectId(), source_id, target_id, rel_name, attrs, function(error, rel_id) {
		if(error){
			growl(error.reason);
		}else{
			growl( 'Created relationship', {type:'s', hideSnark:true} );
		}
	});
};

var saveGraph = function() {
	disableButtons();

	if(!Meteor.user()){
		throwError('You must login to update a diagram');
		enableButtons();
		return false;
	}

	// GET INPUT
	var code = JSON.stringify(Template['tmpl_graphDgm_detail'].graph.toJSON());

	Meteor.call('updateDiagramCode', data._id, code, function(error, diagram) {
		if(error){
			growl(error.reason);
			enableButtons();
		}else{
			Session.set('form_update', false);
			growl( "Diagram updated", {type:'s', hideSnark:true} );
			enableButtons();
		}
	});
};
var deleteGraph = function(_id) {
	if(!Meteor.user()){
		throwError('You must login to delete a diagram');
		return false;
	}

	Meteor.call('deleteDiagram', _id, function(error) {
		if(error){
			growl(error.reason);
		}else{
			growl( "Diagram deleted", {type:'s', hideSnark:true} );
			Router.go('/diagrams');
		}
	});
};
function disableButtons() {
	//$('button').addClass('disabled');
}
function enableButtons() {
	//$('button').removeClass('disabled');
}
