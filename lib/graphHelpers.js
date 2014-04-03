String.prototype.trunc = String.prototype.trunc ||
	function(n){
		var sArray = this.split(' ');
		var s = '';
		for (var i=0; i < sArray.length && i<3; i++) {
			s += sArray[i].length>n ? sArray[i].substr(0,n-1)+'...' : sArray[i];
			if (i !== 2)
				s += "\n";
		}
		if (sArray.length > 3)
			s += '\n...';
		return s;
	};

getOneAway = function(graph) {
	var noun = getSelectedTreeItem(true);
	var parent;
	var nouns = {
		noun: createJoinRect(noun.id, noun.original.class_name, noun.text.trunc(20), null, 12, null, null, null, null)
	};
	if (noun.parent && noun.parent !== '#') {
		parent = Nouns.findOne(noun.parent, {field: {title: 1}});
		nouns.parent = createJoinRect(noun.id, noun.original.class_name, parent.title.trunc(20), null, 10, null, '/nouns/'+noun.parent, null, null);
	}
	if (noun.children && noun.children.length>0) {
		for (var i=0; i < noun.children.length; i++) {
			var child = Nouns.findOne(noun.children[i], {field: {title: 1}});
			nouns[ noun.children[i] ] = createJoinRect(noun.id, noun.class_name, child.title.trunc(20), null, 10, null, '/nouns/'+noun.children[i], null, null);
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
			rel_nouns.push( createJoinRect(noun.id, rel.target_class_name, rel.target_title.trunc(20), null, 10, null, '/nouns/'+rel.target_id, null, null) );
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
			rel_nouns.push( createJoinRect(noun.id, rel.source_class_name, rel.source_title.trunc(20), null, 10, null, '/nouns/'+rel.source_id, null, null) );
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

createJoinRect = function(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth) {
	var colors = getNounColors(class_name);

	var attrs = {
		rect: { rx: 2, ry: 2, width: 50, height: 30, fill: fillColor||colors[0]/*, stroke: strokeColor||'#D35400', 'stroke-width': strokeWidth||5*/ },
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

graphCurrentRelationships = function() {
	var graph = Template['tmpl_graphDgm_detail'].graph;
	if (!graph){ return; }
	var element_ids = [];
	var elements = graph.getElements();

	_.each(elements, function(e){
		graph.removeLinks(e);
		element_ids.push( e.get('attrs').custom._id );
	});

	if (elements_ids) {
		var rels = Relationships.find({project_id:getProjectId(), $in:element_ids}).fetch();
		//ADD MISSING ELEMENTS

		addRelToGraph(rels._id, rels.rel_name, source_graph_id, target_graph_id);
		//TODO
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
	var rel = { source: { id: source_id }, target: { id: target_id }, custom: {_id: _id} };
//	if (label)
//		rel.labels = [{ position: .5, attrs: { text: { text: label || '', 'font-weight': 'bold' } } }];

	if (rel_name === 'composition')
		return new joint.shapes.uml.Composition( rel );
	if (rel_name === 'contains')
		return new joint.shapes.uml.Aggregation( rel );
	if (rel_name === 'uses')
		return new joint.shapes.uml.Uses( rel );
	if (rel_name === 'realization')
		return new joint.shapes.uml.Implementation( rel );
	if (rel_name === 'access')
		return new joint.shapes.uml.Access( rel );
	if (rel_name === 'flow')
		return new joint.shapes.uml.flow( rel );
	if (rel_name === 'assigns')
		return new joint.dia.Link( rel );
	if (rel_name === 'trigger')
		return new joint.shapes.uml.Trigger( rel );
	if (rel_name === 'specialization')
		return new joint.shapes.uml.Generalization( rel );
	if (rel_name === 'association')
		return new joint.dia.Link( rel );
	else
		new joint.dia.Link( rel );
};

addNounToGraph = function(noun) {
	Template['tmpl_graphDgm_detail'].graph.addCell( createJoinRect(noun._id, noun.class_name, noun.title.trunc(20), null, 10, null, null, null, null) );
};

addRelToGraph = function(_id, rel_name, source_graph_id, target_graph_id, label) {
	Template['tmpl_graphDgm_detail'].graph.addCell( createRelLink(_id, rel_name, source_graph_id, target_graph_id, label) );
};

function getNounColors(class_name) {
	var area_code = ea.getClassBelongsToArea(class_name).area_code;

	switch( area_code ){
		case 'a': return ['#A9E2F3', '#000000'];//blue
		case 'b': return ['#F2F5A9', '#000000'];//yellow
		case 't': return ['#27AE60', '#FFFFFF'];//green
		case 'm': {
			if ( class_name === 'Motivation_Stakeholder' || class_name === 'Motivation_Driver' || class_name === 'Motivation_Assessment' )
				return ['#DA81F5', '#000000'];
			else
				return ['#819FF7', '#000000'];
		}
		case 'i': {
			if ( class_name === 'Implementation_Work_Package' || class_name === 'Implementation_Deliverable' )
				return ['#F6CEF5', '#000000'];
			else
				return ['#BCF5A9', '#000000'];
		}
		case 'c': return ['#F2F2F2', '#000000'];//grey
		default: return ['#F2F2F2', '#000000'];//black
	}
}