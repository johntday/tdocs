getOneAway = function(graph) {
	var noun = getSelectedTreeItem(true);
	var parent;
	var nouns = {
		noun: createNounFactory(noun.id, noun.original.class_name, noun.text.trunc(20), null, 12, null, null, null, null, noun.type)
	};
	if (noun.parent && noun.parent !== '#') {
		parent = Nouns.findOne(noun.parent, {field: {title: 1}});
		nouns.parent = createNounFactory(noun.id, noun.original.class_name, parent.title.trunc(20), null, 10, null, '/nouns/'+noun.parent, null, null, parent.type);
	}
	if (noun.children && noun.children.length>0) {
		for (var i=0; i < noun.children.length; i++) {
			var child = Nouns.findOne(noun.children[i], {field: {title: 1}});
			nouns[ noun.children[i] ] = createNounFactory(child._id, child.class_name, child.title.trunc(20), null, 10, null, '/nouns/'+noun.children[i], null, null, child.type);
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
			rel_nouns.push( createNounFactory(noun.id, rel.target_class_name, rel.target_title.trunc(20), null, 10, null, '/nouns/'+rel.target_id, null, null, rel.type) );
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
			rel_nouns.push( createNounFactory(noun.id, rel.source_class_name, rel.source_title.trunc(20), null, 10, null, '/nouns/'+rel.source_id, null, null, rel.type) );
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

createNounFactory = function(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth, type) {
	if (!class_name || type==='root' || class_name.endsWith('_Group'))
		return createGroupFactory(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth);
	if (class_name.endsWith('_Interface'))
		return createInterfaceFactory(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth);
	if (class_name.endsWith('_Service'))
		return createServiceFactory(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth);
	if (class_name.endsWith('_Object'))
		return createDataFactory(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth);
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
var createDataFactory = function(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth) {
	var colors = getNounColors(class_name);

	var group = new joint.shapes.sketch.Data({
		position: { x: 60, y: 20 },
		size: { width: 80, height: 50 }
	});

	var elText = group.get('attrs')['text'];
	elText.text = text;
	elText.fill = textColor||colors[1];
	elText['font-size'] = textFontSize||10;

	var elRect = group.get('attrs')['rect'];
	elRect.fill = fillColor||colors[0];
	elRect['stroke-width'] = strokeWidth||2;
	elRect.stroke = strokeColor||colors[2];

	var elPath = group.get('attrs')['path'];
	elPath['stroke-width'] = strokeWidth||2;
	elPath.stroke = strokeColor||colors[2];

	group.get('attrs')['custom'] = { class_name: class_name, _id: _id };

	if (link && link.length>0)
		group.get('attrs')['a'] = { 'xlink:href': link, 'xlink:show': 'new', cursor: 'pointer' };

	return group;
};
var createServiceFactory = function(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth) {
	var colors = getNounColors(class_name);

	var attrs = {
		rect: { fill: fillColor||colors[0], 'stroke-width': strokeWidth||2, stroke: strokeColor||colors[2] },
		text: { text: text, fill: textColor||colors[1], 'font-size': textFontSize||10 },
		custom: { class_name: class_name, _id: _id }
	};
	if (link && link.length>0)
		attrs.a = { 'xlink:href': link, 'xlink:show': 'new', cursor: 'pointer' };

	return new joint.shapes.sketch.Service({
		position: { x: 60, y: 20 },
		size: { width: 90, height: 40 },
		attrs: attrs
	});
};
var createRectFactory = function(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth) {
	var colors = getNounColors(class_name);

	var attrs = {
		rect: { rx: 2, ry: 2, width: 50, height: 30, fill: fillColor||colors[0], 'stroke-width': strokeWidth||2, stroke: strokeColor||colors[2] },
		text: { text: text, fill: textColor||colors[1], 'font-size': textFontSize||10 },
//		'.myicon': {  style:'@font-face {font-family: "glyphicons"; src: url(#glyphicons_halflingsregular);}',
//			text:'&#x20ac', fill:'#000000', 'font-size':10, 'font-family':'glyphicons'
//		},
//		image: {
//			'ref': 'rect', 'ref-x': .5, 'ref-y': 2,
//			width:10, height:10, 'xlink:href':"/img/deleteEvent.png"
//		},
		custom: { class_name: class_name, _id: _id }
	};
	if (link && link.length>0)
		attrs.a = { 'xlink:href': link, 'xlink:show': 'new', cursor: 'pointer' };
	var icon = getIconPath(class_name);
	if (icon)
		attrs.path = { d:icon[0], transform: icon[1], fill:'#585858', ref:'rect', 'ref-x':icon[2], 'ref-y':icon[3] };

	return new joint.shapes.sketch.ElementLink({
		position: { x: 60, y: 20 },
		size: { width: 90, height: 55 },
		attrs: attrs
	});
};
var createInterfaceFactory = function(_id, class_name, text, textColor, textFontSize, fillColor, link, strokeColor, strokeWidth) {
	var colors = getNounColors(class_name);

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

graphCurrentRelationships = function(cell) {
	var graph = Template['tmpl_graphDgm_detail'].graph;
	if (!graph){ return; }
	var element_ids = [];
	var id_map = {};
	var elements = graph.getElements();

	_.each(elements, function(e){
		if (!cell)
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
				if (!cell || (source_graph_id===cell.id || target_graph_id===cell.id) )
					addRelToGraph(r._id, r.rel_name, source_graph_id, target_graph_id);
			}
		});
	}
};

graphCurrentNouns = function() {
	var graph = Template['tmpl_graphDgm_detail'].graph;
	if (!graph){ return; }
	var element_ids = [];
	var elements = graph.getElements();

	_.each(elements, function(e){
		var _id = e.attributes.attrs.custom._id;
		element_ids.push( _id );
	});
	return element_ids;
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
		var cell = createNounFactory(noun._id, noun.class_name, noun.title.trunc(20), null, 10, null, null, null, null, noun.type);
		graph.addCell( cell );

		graphCurrentRelationships( cell );
	}
};

addRelToGraph = function(_id, rel_name, source_graph_id, target_graph_id, label) {
	Template['tmpl_graphDgm_detail'].graph.addCell( createRelLink(_id, rel_name, source_graph_id, target_graph_id, label) );
};

function getNounColors(class_name) {
	var colors;
	var area_code = ea.getClassBelongsToArea(class_name).area_code;

	switch( area_code ){
		// [FILL, TEXT, STROKE]
		case 'a': colors = ['#A9E2F3'/*blue*/, '#000000', '#000000']; break;
		case 'b': colors = ['#F2F5A9'/*yellow*/, '#000000', '#000000']; break;
		case 't': colors = ['#27AE60'/*green*/, '#FFFFFF', '#0B3B0B']; break;
		case 'm': {
			if ( class_name === 'Motivation_Stakeholder' || class_name === 'Motivation_Driver' || class_name === 'Motivation_Assessment' )
				colors = ['#DA81F5'/*xx*/, '#000000', '#8A0868'];
			else
				colors = ['#819FF7'/*xx*/, '#000000', '#000000'];
			break;
		}
		case 'i': {
			if ( class_name === 'Implementation_Work_Package' || class_name === 'Implementation_Deliverable' )
				colors = ['#F6CEF5'/*xx*/, '#000000', '#000000'];
			else
				colors = ['#BCF5A9'/*xx*/, '#000000', '#000000'];
			break;
		}
		case 'c': colors = ['#F2F2F2'/*grey*/, '#000000', '#424242']; break;
		default: colors = ['#F2F2F2'/*black*/, '#000000', '#000000'];
	}
	// EXCEPTIONS
	if (class_name.endsWith('_Interface')){
		colors[1] = '#000000';
	}
	return colors;
}

function getIconPath(class_name) {
	var icon;
	switch( class_name ){
		case 'Business_Actor': icon = [
			'M0 0v143l400 257v100q-37 0 -68.5 74.5t-31.5 125.5v200q0 124 88 212t212 88t212 -88t88 -212v-200q0 -51 -31.5 -125.5t-68.5 -74.5v-100l400 -257v-143h-1200z'
		    ,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Application_Component': icon = [
			'M0 50v400q0 21 14.5 35.5t35.5 14.5h400q21 0 35.5 -14.5t14.5 -35.5v-400q0 -21 -14.5 -35.5t-35.5 -14.5h-400q-21 0 -35.5 14.5t-14.5 35.5zM0 650v400q0 21 14.5 35.5t35.5 14.5h400q21 0 35.5 -14.5t14.5 -35.5v-400q0 -21 -14.5 -35.5t-35.5 -14.5h-400 q-21 0 -35.5 14.5t-14.5 35.5zM600 50v400q0 21 14.5 35.5t35.5 14.5h400q21 0 35.5 -14.5t14.5 -35.5v-400q0 -21 -14.5 -35.5t-35.5 -14.5h-400q-21 0 -35.5 14.5t-14.5 35.5zM600 650v400q0 21 14.5 35.5t35.5 14.5h400q21 0 35.5 -14.5t14.5 -35.5v-400 q0 -21 -14.5 -35.5t-35.5 -14.5h-400q-21 0 -35.5 14.5t-14.5 35.5z'
			,'scale(0.008)', 2, 2];
			break;
		case 'Technology_Software': icon = [
			'M0 50v200q0 21 14.5 35.5t35.5 14.5h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5zM0 450v200q0 21 14.5 35.5t35.5 14.5h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200 q-21 0 -35.5 14.5t-14.5 35.5zM0 850v200q0 21 14.5 35.5t35.5 14.5h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5zM400 50v200q0 21 14.5 35.5t35.5 14.5h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5 t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5zM400 450v200q0 21 14.5 35.5t35.5 14.5h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5zM400 850v200q0 21 14.5 35.5t35.5 14.5h200q21 0 35.5 -14.5t14.5 -35.5 v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5zM800 50v200q0 21 14.5 35.5t35.5 14.5h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5zM800 450v200q0 21 14.5 35.5t35.5 14.5h200 q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5zM800 850v200q0 21 14.5 35.5t35.5 14.5h200q21 0 35.5 -14.5t14.5 -35.5v-200q0 -21 -14.5 -35.5t-35.5 -14.5h-200q-21 0 -35.5 14.5t-14.5 35.5z'
			,'scale(0.008)', 2, 2];
			break;
		case 'Technology_Artifact': icon = [
			'M100 25v1150q0 11 7 18t18 7h475v-500h400v-675q0 -11 -7 -18t-18 -7h-850q-11 0 -18 7t-7 18zM700 800v300l300 -300h-300z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Implementation_Plateau': icon = [
			'M-100 0l431 1200h209l-21 -300h162l-20 300h208l431 -1200h-538l-41 400h-242l-40 -400h-539zM488 500h224l-27 300h-170z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Implementation_Deliverable': icon = [
			'M100 0h1100v1200h-1100v-1200zM200 100v900h900v-900h-900zM300 200v100h100v-100h-100zM300 400v100h100v-100h-100zM300 600v100h100v-100h-100zM300 800v100h100v-100h-100zM500 200h500v100h-500v-100zM500 400v100h500v-100h-500zM500 600v100h500v-100h-500z M500 800v100h500v-100h-500z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Motivation_Stakeholder': icon = [
			'M100 0v1100h100v-1100h-100zM300 400q60 60 127.5 84t127.5 17.5t122 -23t119 -30t110 -11t103 42t91 120.5v500q-40 -81 -101.5 -115.5t-127.5 -29.5t-138 25t-139.5 40t-125.5 25t-103 -29.5t-65 -115.5v-500z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Implementation_Work_Package': icon = [
			'M100 0v1025l175 175h925v-1000l-100 -100v1000h-750l-100 -100h750v-1000h-900z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Business_Location': icon = [
			'M148 745q0 124 60.5 231.5t165 172t226.5 64.5q123 0 227 -63t164.5 -169.5t60.5 -229.5t-73 -272q-73 -114 -166.5 -237t-150.5 -189l-57 -66q-10 9 -27 26t-66.5 70.5t-96 109t-104 135.5t-100.5 155q-63 139 -63 262zM342 772q0 -107 75.5 -182.5t181.5 -75.5 q107 0 182.5 75.5t75.5 182.5t-75.5 182t-182.5 75t-182 -75.5t-75 -181.5z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Technology_Node': icon = [
			'M200 150q0 -20 14.5 -35t35.5 -15h800q21 0 35.5 15t14.5 35v800q0 21 -14.5 35.5t-35.5 14.5h-800q-21 0 -35.5 -14.5t-14.5 -35.5v-800z'
			,'scale(0.008)', 2, 2];
			break;
		case 'Motivation_Principle': icon = [
			'M0 500v200h195q31 125 98.5 199.5t206.5 100.5v200h200v-200q54 -20 113 -60t112.5 -105.5t71.5 -134.5h203v-200h-203q-25 -102 -116.5 -186t-180.5 -117v-197h-200v197q-140 27 -208 102.5t-98 200.5h-194zM290 500q24 -73 79.5 -127.5t130.5 -78.5v206h200v-206 q149 48 201 206h-201v200h200q-25 74 -75.5 127t-124.5 77v-204h-200v203q-75 -23 -130 -77t-79 -126h209v-200h-210z'
			,'scale(0.008)', 2, 2];
			break;
		case 'Business_Process': icon = [
			'M0 547l600 453v-300h600v-300h-600v-301z'
			,'scale(0.008) rotate(180)', 20, 15];
			break;
		case 'Implementation_Gap': icon = [
			'M0 0v400l129 -129l294 294l142 -142l-294 -294l129 -129h-400zM635 777l142 -142l294 294l129 -129v400h-400l129 -129z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Motivation_Driver': icon = [
			'M0 -22v143l216 193q-9 53 -13 83t-5.5 94t9 113t38.5 114t74 124q47 60 99.5 102.5t103 68t127.5 48t145.5 37.5t184.5 43.5t220 58.5q0 -189 -22 -343t-59 -258t-89 -181.5t-108.5 -120t-122 -68t-125.5 -30t-121.5 -1.5t-107.5 12.5t-87.5 17t-56.5 7.5l-99 -55z M238.5 300.5q19.5 -6.5 86.5 76.5q55 66 367 234q70 38 118.5 69.5t102 79t99 111.5t86.5 148q22 50 24 60t-6 19q-7 5 -17 5t-26.5 -14.5t-33.5 -39.5q-35 -51 -113.5 -108.5t-139.5 -89.5l-61 -32q-369 -197 -458 -401q-48 -111 -28.5 -117.5z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Business_Function':
		case 'Technology_Function':
		case 'Application_Function':
			icon = [
			'M-30 411l227 -227l352 353l353 -353l226 227l-578 579z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Motivation_Requirement': icon = [
			'M-101 600v50q0 24 25 49t50 38l25 13v-250l-11 5.5t-24 14t-30 21.5t-24 27.5t-11 31.5zM100 500v250v8v8v7t0.5 7t1.5 5.5t2 5t3 4t4.5 3.5t6 1.5t7.5 0.5h200l675 250v-850l-675 200h-38l47 -276q2 -12 -3 -17.5t-11 -6t-21 -0.5h-8h-83q-20 0 -34.5 14t-18.5 35 q-55 337 -55 351zM1100 200v850q0 21 14.5 35.5t35.5 14.5q20 0 35 -14.5t15 -35.5v-850q0 -20 -15 -35t-35 -15q-21 0 -35.5 15t-14.5 35z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Motivation_Constraint': icon = [
			'M57 353q0 -95 66 -159l141 -142q68 -66 159 -66q93 0 159 66l283 283q66 66 66 159t-66 159l-141 141q-8 9 -19 17l-105 -105l212 -212l-389 -389l-247 248l95 95l-18 18q-46 45 -75 101l-55 -55q-66 -66 -66 -159zM269 706q0 -93 66 -159l141 -141q7 -7 19 -17l105 105 l-212 212l389 389l247 -247l-95 -96l18 -17q47 -49 77 -100l29 29q35 35 62.5 88t27.5 96q0 93 -66 159l-141 141q-66 66 -159 66q-95 0 -159 -66l-283 -283q-66 -64 -66 -159z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Business_Event': icon = [
			'M74 350q0 21 13.5 35.5t33.5 14.5h18l117 173l63 327q15 77 76 140t144 83l-18 32q-6 19 3 32t29 13h94q20 0 29 -10.5t3 -29.5q-18 -36 -18 -37q83 -19 144 -82.5t76 -140.5l63 -327l118 -173h17q20 0 33.5 -14.5t13.5 -35.5q0 -20 -13 -40t-31 -27q-8 -3 -23 -8.5 t-65 -20t-103 -25t-132.5 -19.5t-158.5 -9q-125 0 -245.5 20.5t-178.5 40.5l-58 20q-18 7 -31 27.5t-13 40.5zM497 110q12 -49 40 -79.5t63 -30.5t63 30.5t39 79.5q-48 -6 -102 -6t-103 6z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Technology_Device': icon = [
			'M0 196v100q0 41 29.5 70.5t70.5 29.5h1000q41 0 70.5 -29.5t29.5 -70.5v-100q0 -41 -29.5 -70.5t-70.5 -29.5h-1000q-41 0 -70.5 29.5t-29.5 70.5zM0 596v100q0 41 29.5 70.5t70.5 29.5h1000q41 0 70.5 -29.5t29.5 -70.5v-100q0 -41 -29.5 -70.5t-70.5 -29.5h-1000 q-41 0 -70.5 29.5t-29.5 70.5zM0 996v100q0 41 29.5 70.5t70.5 29.5h1000q41 0 70.5 -29.5t29.5 -70.5v-100q0 -41 -29.5 -70.5t-70.5 -29.5h-1000q-41 0 -70.5 29.5t-29.5 70.5zM600 596h500v100h-500v-100zM800 196h300v100h-300v-100zM900 996h200v100h-200v-100z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Motivation_Goal': icon = [
			'M4 600q0 162 80 299t217 217t299 80t299 -80t217 -217t80 -299t-80 -299t-217 -217t-299 -80t-299 80t-217 217t-80 299zM186 600q0 -171 121.5 -292.5t292.5 -121.5t292.5 121.5t121.5 292.5t-121.5 292.5t-292.5 121.5t-292.5 -121.5t-121.5 -292.5zM406 600 q0 80 57 137t137 57t137 -57t57 -137t-57 -137t-137 -57t-137 57t-57 137z'
			,'scale(0.008)', 2, 2];
			break;
		case 'Technology_Network': icon = [
			'M-14 494q0 -80 56.5 -137t135.5 -57h750q120 0 205 86.5t85 207.5t-85 207t-205 86q-46 0 -90 -14q-44 97 -134.5 156.5t-200.5 59.5q-152 0 -260 -107.5t-108 -260.5q0 -25 2 -37q-66 -14 -108.5 -67.5t-42.5 -122.5z'
			,'scale(0.008) rotate(180)', 20, 20];
			break;
		case 'Business_Role': icon = [
			'M0 600q0 162 80 299t217 217t299 80t299 -80t217 -217t80 -299t-80 -299t-217 -217t-299 -80t-299 80t-217 217t-80 299zM182 600q0 -171 121.5 -292.5t292.5 -121.5t292.5 121.5t121.5 292.5t-121.5 292.5t-292.5 121.5t-292.5 -121.5t-121.5 -292.5zM400 400v400h300 l100 -100v-100h-100v100h-200v-100h200v-100h-200v-100h-100zM700 400v100h100v-100h-100z'
			,'scale(0.008,-0.008)', 2, 20];
			break;


	}
	return icon;
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
