Template.relationshipDiagram.helpers({
});

/*------------------------------------------------------------------------------------------------------------------------------*/
Template.relationshipDiagram.events({
	'click a': function(e) {
		e.preventDefault();
		var link = $(e.currentTarget).attr('href');
		if (link && link !== '#') {
			Router.go( link );
		}
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.relationshipDiagram.rendered = function() {
//	if (graph)
//		$('#noun_paper').empty();
	drawNounDiagram();
};
/*---------- FUNCTIONS and VARs ------------------------------------------------------------------------------------------------*/
var drawNounDiagram = function() {
	graph = new joint.dia.Graph;

	var width = $("#noun_panel_diagram").width() - 40;
	var height = 400;
	var paper = new joint.dia.Paper({
		el: $('#noun_paper'),
		width: width,
		height: height,
		gridSize: 1,
		model: graph
	});

	getOneAway(graph);

	if (animateFrameRequestID) {
		cancelAnimationFrame(animateFrameRequestID);
	}

	if (graph.get('cells').length === 0) {
		// There is nothing to layout.
		return;
	}

	var graphLayout = new joint.layout.ForceDirected({
		graph: graph,
		width: width - 40,
		height: height - 60,
		charge: 780,
		linkStrength: .5,
		linkDistance: (width<height) ? width/2 : height/2,
		gravityCenter: { x: width/2, y: height/2 - 40 }
	});

	graphLayout.start();

	function animate() {
		animateFrameRequestID = requestAnimationFrame(animate);
		graphLayout.step();
	}
	animate();

};

var animateFrameRequestID;
var graph;