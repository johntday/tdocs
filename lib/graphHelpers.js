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
	//console.log( noun );
	var parent;
	var nouns = {
		noun: createJoinRect(noun.text.trunc(20), null, 12, 'blue', null, null, null)
	};
	if (noun.parent && noun.parent !== '#') {
		parent = Nouns.findOne(noun.parent, {field: {title: 1}});
		nouns.parent = createJoinRect(parent.title.trunc(20), null, 10, null, '/nouns/'+noun.parent, null, null);
	}
	if (noun.children && noun.children.length>0) {
		for (var i=0; i < noun.children.length; i++) {
			var child = Nouns.findOne(noun.children[i], {field: {title: 1}});
			nouns[ noun.children[i] ] = createJoinRect(child.title.trunc(20), null, 10, null, '/nouns/'+noun.children[i], null, null);
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
			rel_nouns.push( createJoinRect(rel.target_title.trunc(20), null, 10, null, '/nouns/'+rel.target_id, null, null) );
		});
	}
	_.each(rel_nouns, function(c) { graph.addCell(c); });
	//
	relations = [];
	_.each(rel_nouns, function(c, idx) {
		relations.push( createRelLink( rels[idx].rel_name, nouns.noun.id, c.id ) );
	});
	_.each(relations, function(r) { graph.addCell(r); });

	//TARGET
	rel_nouns = [];
	rels = Relationships.find({project_id: getProjectId(), target_id: noun.id}).fetch();
	if (rels && rels.length > 0) {
		_.each(rels, function(rel){
			rel_nouns.push( createJoinRect(rel.source_title.trunc(20), null, 10, null, '/nouns/'+rel.source_id, null, null) );
		});
	}
	_.each(rel_nouns, function(c) { graph.addCell(c); });
	//
	relations = [];
	_.each(rel_nouns, function(c, idx) {
		relations.push( createRelLink( rels[idx].rel_name, nouns.noun.id, c.id ) );
	});
	_.each(relations, function(r) { graph.addCell(r); });

};

createJoinRect = function(text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth) {
	var attrs = {
		rect: { rx: 2, ry: 2, width: 50, height: 30, fill: fillColor||'#27AE60'/*, stroke: strokeColor||'#D35400', 'stroke-width': strokeWidth||5*/ },
		text: { text: text, fill: textColor||'white', 'font-size': textFontSize||10 }
	};
	if (link)
		attrs.a = { 'xlink:href': link, 'xlink:show': 'new', cursor: 'pointer' };

	return new joint.shapes.sketch.ElementLink({
		position: { x: 60, y: 20 },
		size: { width: 100, height: 60 },
		attrs: attrs
	});
};

createRelLink = function(rel_name, source_id, target_id) {
	if (rel_name === 'composition')
		return new joint.shapes.uml.Composition({ source: { id: source_id }, target: { id: target_id }});
	if (rel_name === 'contains')
		return new joint.shapes.uml.Aggregation({ source: { id: source_id }, target: { id: target_id }});
	if (rel_name === 'uses')
		return new joint.shapes.uml.Implementation({ source: { id: source_id }, target: { id: target_id }});
	if (rel_name === 'realization')
		return new joint.shapes.uml.Generalization({ source: { id: source_id }, target: { id: target_id }});
	if (rel_name === 'access')
		return new joint.dia.Link({ source: { id: source_id }, target: { id: target_id }});
	if (rel_name === 'flow')
		return new joint.shapes.uml.flow({ source: { id: source_id }, target: { id: target_id }});
	if (rel_name === 'assigns')
		return new joint.dia.Link({ source: { id: source_id }, target: { id: target_id }});
	if (rel_name === 'trigger')
		return new joint.dia.Link({ source: { id: source_id }, target: { id: target_id }});
	if (rel_name === 'specialization')
		return new joint.shapes.uml.Generalization({ source: { id: source_id }, target: { id: target_id }});
	if (rel_name === 'association')
		return new joint.dia.Link({ source: { id: source_id }, target: { id: target_id }});
	else
		new joint.dia.Link({ source: { id: source_id }, target: { id: target_id }});
};