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
};

createJoinRect = function(text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth) {
	return new joint.shapes.sketch.ElementLink({
		position: { x: 60, y: 20 },
		size: { width: 100, height: 60 },
		attrs: {
			rect: { rx: 2, ry: 2, width: 50, height: 30, fill: fillColor||'#27AE60'/*, stroke: strokeColor||'#D35400', 'stroke-width': strokeWidth||5*/ },
			a: { 'xlink:href': link||'#', 'xlink:show': 'new', cursor: 'pointer' },
			text: { text: text, fill: textColor||'white', 'font-size': textFontSize||10 }
		}
	});
};
