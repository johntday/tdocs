getOneAway = function(graph) {
	var noun = getSelectedTreeItem(true);
	var parent;
	var nouns = {
		noun: createNounFactory(noun.id, noun.original.class_name, noun.text.trunc(20), null, 12, null, null, null, null)
	};
	if (noun.parent && noun.parent !== '#') {
		parent = Nouns.findOne(noun.parent, {field: {title: 1}});
		nouns.parent = createNounFactory(noun.id, noun.original.class_name, parent.title.trunc(20), null, 10, null, '/nouns/'+noun.parent, null, null);
	}
	if (noun.children && noun.children.length>0) {
		for (var i=0; i < noun.children.length; i++) {
			var child = Nouns.findOne(noun.children[i], {field: {title: 1}});
			nouns[ noun.children[i] ] = createNounFactory(noun.id, noun.class_name, child.title.trunc(20), null, 10, null, '/nouns/'+noun.children[i], null, null);
		}
	}
	_.each(nouns, function(c) { graph.addCell(c); });

	var relations = [];
	if (parent) {
		relations.push( new joint.shapes.uml.Composition({ source: { id: nouns.noun.id }, target: { id: nouns.parent.id }}) );
			//		new uml.Generalization({ source: { id: classes.man.id }, target: { id: classes.person.id }}),
			//		new uml.Implementation({ source: { id: classes.person.id }, target: { id: classes.mammal.id }}),
			//		new uml.Aggregation({ source: { id: classes.person.id }, target: { id: classes.address.id }}),
	}
	if (noun.children && noun.children.length>0) {
		for (var i=0; i < noun.children.length; i++) {
			relations.push( new joint.shapes.uml.Composition({ source: { id: nouns[noun.children[i]] }, target: { id: nouns.noun.id }}) );
		}
	}
	_.each(relations, function(r) { graph.addCell(r); });


	//SOURCE
	var rel_nouns = [];
	var rels = Relationships.find({project_id: getProjectId(), source_id: noun.id}).fetch();
	if (rels && rels.length > 0) {
		_.each(rels, function(rel){
			rel_nouns.push( createNounFactory(noun.id, rel.target_class_name, rel.target_title.trunc(20), null, 10, null, '/nouns/'+rel.target_id, null, null) );
		});
	}
	_.each(rel_nouns, function(c) { graph.addCell(c); });
	//
	relations = [];
	_.each(rel_nouns, function(c, idx) {
		relations.push( createRelLink( Random.id(), rels[idx].rel_name, nouns.noun.id, c.id ) );
	});
	_.each(relations, function(r) { graph.addCell(r); });

	//TARGET
	rel_nouns = [];
	rels = Relationships.find({project_id: getProjectId(), target_id: noun.id}).fetch();
	if (rels && rels.length > 0) {
		_.each(rels, function(rel){
			rel_nouns.push( createNounFactory(noun.id, rel.source_class_name, rel.source_title.trunc(20), null, 10, null, '/nouns/'+rel.source_id, null, null) );
		});
	}
	_.each(rel_nouns, function(c) { graph.addCell(c); });
	//
	relations = [];
	_.each(rel_nouns, function(c, idx) {
		relations.push( createRelLink( Random.id(), rels[idx].rel_name, c.id, nouns.noun.id ) );
	});
	_.each(relations, function(r) { graph.addCell(r); });

};

createNounFactory = function(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth) {
	if (!class_name || class_name.endsWith('_Group'))
		return createGroupFactory(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth);
	if (class_name.endsWith('_Interface'))
		return createInterfaceFactory(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth);
	return createRectFactory(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth);
};
var createGroupFactory = function(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth) {
	//var colors = getNounColors(class_name);

	var group = new joint.shapes.sketch.Group({
		position: { x: 60, y: 20 },
		size: { width: 80, height: 50 }
	});

	group.get('attrs')['.sketch-group-name'].text = text;
	group.get('attrs')['custom'] = { class_name: class_name, _id: _id };
	if (link && link.length>0)
		group.get('attrs')['a'] = { 'xlink:href': link, 'xlink:show': 'new', cursor: 'pointer' };

	return group;
};
var createRectFactory = function(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth) {
	var colors = getNounColors(class_name);

	var attrs = {
		rect: { rx: 2, ry: 2, width: 50, height: 30, fill: fillColor||colors[0], 'stroke-width': strokeWidth||2, stroke: strokeColor||colors[2] },
		text: { text: text, fill: textColor||colors[1], 'font-size': textFontSize||10 },
		custom: { class_name: class_name, _id: _id }
	};
	if (link && link.length>0)
		attrs.a = { 'xlink:href': link, 'xlink:show': 'new', cursor: 'pointer' };

	return new joint.shapes.sketch.ElementLink({
		position: { x: 60, y: 20 },
		size: { width: 80, height: 50 },
		attrs: attrs
	});
};
var createInterfaceFactory = function(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth) {
	var colors = getNounColors(class_name);

	//attrs: { circle: { 'fill': '#34495e', 'stroke': '#2c3e50', 'stroke-width': 2, 'rx': 1 }}

	var attrs = {
		circle: { fill: fillColor||colors[0], 'stroke-width': strokeWidth||2, stroke: strokeColor||colors[2] },
		text: { text: text, fill: textColor||colors[1], 'font-size': textFontSize||10, 'ref': 'circle', 'ref-x': .5, 'ref-y': -15, 'text-anchor': 'middle' },
		custom: { class_name: class_name, _id: _id }
	};
	if (link && link.length>0)
		attrs.a = { 'xlink:href': link, 'xlink:show': 'new', cursor: 'pointer' };

	return new joint.shapes.sketch.Interface({
		position: { x: 60, y: 20 },
		size: { width: 30, height: 30 },
		attrs: attrs
	});
};
var createRectHtmlFactory = function(_id, class_name, text) {
	var attrs = {
		custom: { class_name: class_name, _id: _id }
	};
	var options = ea.getClassBelongsToArea(class_name);

	return new joint.shapes.html.Element({
		position: { x: 60, y: 20 },
		size: { width: 80, height: 50 },
		attrs: attrs,
		area_code: options.area_code,
		icon: options.icon,
		title: text
	});
};

showLegend = function(graph) {
	alert('Not ready yet');
	return null;

	var legend = new joint.shapes.sketch.Legend({
		position: { x: 200, y: 60 },
		size: { width: 200, height: 200 }
	});
	legend.get('attrs')['.sketch-legend-name'].text = "Legend";
	graph.addCell( legend );
	legend.toFront();

	return legend.id;
};

graphCurrentRelationships = function() {
	var graph = Template['tmpl_graphDgm_detail'].graph;
	if (!graph){ return; }
	var element_ids = [];
	var id_map = {};
	var elements = graph.getElements();

	_.each(elements, function(e){
		graph.removeLinks(e);
		var _id = e.attributes.attrs.custom._id;
		element_ids.push( _id );
		id_map[_id] = e.id;
	});

	if (element_ids) {
		var rels = Relationships.find({project_id:getProjectId(), $or:[{source_id: {$in:element_ids}}, {target_id: {$in:element_ids}}]}).fetch();

		_.each(rels, function(r){
			var source_graph_id = id_map[r.source_id];
			var target_graph_id = id_map[r.target_id];
			if (source_graph_id && target_graph_id) {
				addRelToGraph(r._id, r.rel_name, source_graph_id, target_graph_id);
			}
		});

	}
};

showHideAllLinkLabels = function(graph, id, isShow) {
	var links = graph.getLinks();
	_.each(links, function(l){
		if (isShow)
			l.attr('.labels/display', 'inline-block');  // show
		else
			l.attr('.labels/display', 'none');   // hide
	});
};

showHideLinkLabel = function(graph, id, isShow) {
	var link = graph.getCell(id);
	if (isShow)
		link.attr('.labels/display', 'inline-block');  // show
	else
		link.attr('.labels/display', 'none');   // hide
};

createRelLink = function(_id, rel_name, source_id, target_id, label) {
	var rel   = { source: { id: source_id }, target: { id: target_id }, custom: {_id: _id} };
	var r_rel = { source: { id: target_id }, target: { id: source_id }, custom: {_id: _id} };
//	if (label)
//		rel.labels = [{ position: .5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }];

	if (rel_name === 'composition')
		return new joint.shapes.uml.Composition( r_rel );
	if (rel_name === 'contains')
		return new joint.shapes.uml.Aggregation( r_rel );
	if (rel_name === 'uses')
		return new joint.shapes.uml.Uses( rel );
	if (rel_name === 'realization')
		return new joint.shapes.uml.Implementation( rel );
	if (rel_name === 'access')
		return new joint.shapes.uml.Access( rel );
	if (rel_name === 'flow')
		return new joint.shapes.uml.Flow( rel );
	if (rel_name === 'assigns')
		return new joint.shapes.uml.Assign( rel );
	if (rel_name === 'trigger')
		return new joint.shapes.uml.Trigger( rel );
	if (rel_name === 'specialization')
		return new joint.shapes.uml.Generalization( rel );
	if (rel_name === 'association')
		return new joint.dia.Link( rel );
	if (rel_name === 'influence')
		return new joint.shapes.uml.Influence( rel );
	else
		new joint.dia.Link( rel );
};

addNounToGraph = function(noun) {
	var graph = Template['tmpl_graphDgm_detail'].graph;
	var elements = graph.getElements();
	var doAdd = true;

	_.each(elements, function(e){
		var _id = e.attributes.attrs.custom._id;
		if (_id === noun._id){
			growl('Already have "'+noun.title+'" on the diagram');
			doAdd = false;
			return;
		}
	});
	if (doAdd) {
		graph.addCell( createNounFactory(noun._id, noun.class_name, noun.title.trunc(20), null, 10, null, null, null, null) );
		//graph.addCell( createRectHtmlFactory(noun._id, noun.class_name, noun.title) );

		graphCurrentRelationships();
	}
};

addRelToGraph = function(_id, rel_name, source_graph_id, target_graph_id, label) {
	Template['tmpl_graphDgm_detail'].graph.addCell( createRelLink(_id, rel_name, source_graph_id, target_graph_id, label) );
};

function getNounColors(class_name) {
	var area_code = ea.getClassBelongsToArea(class_name).area_code;

	switch( area_code ){
		//FILL, TEXT, STROKE
		case 'a': return ['#A9E2F3', '#000000', '#2E2EFE'];//blue
		case 'b': return ['#F2F5A9', '#000000', '#000000'];//yellow
		case 't': return ['#27AE60', '#FFFFFF', '#0B3B0B'];//green
		case 'm': {
			if ( class_name === 'Motivation_Stakeholder' || class_name === 'Motivation_Driver' || class_name === 'Motivation_Assessment' )
				return ['#DA81F5', '#000000', '#8A0868'];
			else
				return ['#819FF7', '#000000', '#000000'];
		}
		case 'i': {
			if ( class_name === 'Implementation_Work_Package' || class_name === 'Implementation_Deliverable' )
				return ['#F6CEF5', '#000000', '#000000'];
			else
				return ['#BCF5A9', '#000000', '#000000'];
		}
		case 'c': return ['#F2F2F2', '#000000', '#424242'];//grey
		default: return ['#F2F2F2', '#000000', '#000000'];//black
	}
}

adjustVertices = function(graph, cell) {

	// If the cell is a view, find its model.
	cell = cell.model || cell;

	if (cell instanceof joint.dia.Element) {

		_.chain(graph.getConnectedLinks(cell)).groupBy(function(link) {
			// the key of the group is the model id of the link's source or target, but not our cell id.
			return _.omit([link.get('source').id, link.get('target').id], cell.id)[0];
		}).each(function(group, key) {
				// If the member of the group has both source and target model adjust vertices.
				if (key !== 'undefined') adjustVertices(graph, _.first(group));
			});

		return;
	}

	// The cell is a link. Let's find its source and target models.
	var srcId = cell.get('source').id || cell.previous('source').id;
	var trgId = cell.get('target').id || cell.previous('target').id;

	// If one of the ends is not a model, the link has no siblings.
	if (!srcId || !trgId) return;

	var siblings = _.filter(graph.getLinks(), function(sibling) {

		var _srcId = sibling.get('source').id;
		var _trgId = sibling.get('target').id;

		return (_srcId === srcId && _trgId === trgId) || (_srcId === trgId && _trgId === srcId);
	});

	switch (siblings.length) {

		case 0:
			// The link was removed and had no siblings.
			break;

		case 1:
			// There is only one link between the source and target. No vertices needed.
			cell.unset('vertices');
			break;

		default:

			// There is more than one siblings. We need to create vertices.

			// First of all we'll find the middle point of the link.
			var srcCenter = graph.getCell(srcId).getBBox().center();
			var trgCenter = graph.getCell(trgId).getBBox().center();
			var midPoint = g.line(srcCenter, trgCenter).midpoint();

			// Then find the angle it forms.
			var theta = srcCenter.theta(trgCenter);

			// This is the maximum distance between links
			var gap = 20;

			_.each(siblings, function(sibling, index) {

				// We want the offset values to be calculated as follows 0, 20, 20, 40, 40, 60, 60 ..
				var offset = gap * Math.ceil(index / 2);

				// Now we need the vertices to be placed at points which are 'offset' pixels distant
				// from the first link and forms a perpendicular angle to it. And as index goes up
				// alternate left and right.
				//
				//  ^  odd indexes
				//  |
				//  |---->  index 0 line (straight line between a source center and a target center.
				//  |
				//  v  even indexes
				var sign = index % 2 ? 1 : -1;
				var angle = g.toRad(theta + sign * 90);

				// We found the vertex.
				var vertex = g.point.fromPolar(offset, angle, midPoint);

				sibling.set('vertices', [{ x: vertex.x, y: vertex.y }]);
			});
	}
};
