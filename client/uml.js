joint.shapes.uml = {};

/**
 * LINKS
 */
joint.shapes.uml.Generalization = joint.dia.Link.extend({
	defaults: {
		type: 'uml.Generalization',
		attrs: { '.marker-target': { d: 'M 20 0 L 0 10 L 20 20 z', fill: 'white' }}
	}
});
joint.shapes.uml.Trigger = joint.dia.Link.extend({
	defaults: {
		type: 'uml.Trigger',
		attrs: {
			'.connection': { stroke: '#2E2EFE' },
			'.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
		}
	}
});
//			'.marker-source': { stroke: '#3498DB', fill: '#3498DB', d: 'M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z' },
joint.shapes.uml.Assign = joint.dia.Link.extend({
	defaults: {
		type: 'uml.Assign',
		attrs: {
			'.connection': { stroke: 'black', 'stroke-width': 2 },
			'.marker-source': { stroke: '#3498DB', fill: '#3498DB', d: 'M3,3m-3,0a3,3 0 1,0 6,0a3,3 0 1,0 -6,0z' },
			'.marker-target': { stroke: '#3498DB', fill: '#3498DB', d: 'M3,3m-3,0a3,3 0 1,0 6,0a3,3 0 1,0 -6,0z' }
		}
	}
});
joint.shapes.uml.Flow = joint.dia.Link.extend({
	defaults: {
		type: 'uml.Flow',
		attrs: {
			'.connection': { stroke: '#3498DB', 'stroke-width': 3, 'stroke-dasharray': '5,2' },
			'.marker-target': { fill: '#FA5882', d: 'M 10 0 L 0 5 L 10 10 z' }
		}
	}
});
joint.shapes.uml.Access = joint.dia.Link.extend({
	defaults: {
		type: 'uml.Access',
		attrs: {
			'.connection': { stroke: '#2E2EFE', 'stroke-width': 3, 'stroke-dasharray': '5,2' },
			'.marker-target': { fill: '#81F781', d: 'M 10 0 L 0 5 L 10 10 z' }
		}
	}
});
joint.shapes.uml.Influence = joint.dia.Link.extend({
	defaults: {
		type: 'uml.Influence',
		attrs: {
			'.connection': { stroke: '#FE642E', 'stroke-width': 3, 'stroke-dasharray': '5,2' },
			'.marker-target': { fill: '#F7FE2E', d: 'M 10 0 L 0 5 L 10 10 z' }
		}
	}
});
joint.shapes.uml.Implementation = joint.dia.Link.extend({
	defaults: {
		type: 'uml.Implementation',
		attrs: {
			'.marker-target': { d: 'M 20 0 L 0 10 L 20 20 z', fill: 'white' },
			'.connection': { 'stroke-dasharray': '3,3' }
		}
	}
});
joint.shapes.uml.Aggregation = joint.dia.Link.extend({
	defaults: {
		type: 'uml.Aggregation',
		attrs: { '.marker-target': { d: 'M 40 10 L 20 20 L 0 10 L 20 0 z', fill: 'white' }}
	}
});

joint.shapes.uml.Composition = joint.dia.Link.extend({
	defaults: {
		type: 'uml.Composition',
		attrs: { '.marker-target': { d: 'M 40 10 L 20 20 L 0 10 L 20 0 z', fill: 'black' }}
	}
});
joint.shapes.uml.Uses = joint.dia.Link.extend({
	defaults: {
		type: 'uml.Uses',
		attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', fill: 'black' }}
	}
});
joint.shapes.uml.Association = joint.dia.Link.extend({
	defaults: { type: 'uml.Association' }
});

// Statechart

joint.shapes.uml.State = joint.shapes.basic.Generic.extend({

	markup: [
		'<g class="rotatable">',
		'<g class="scalable">',
		'<rect/>',
		'</g>',
		'<path/><text class="uml-state-name"/><text class="uml-state-events"/>',
		'</g>'
	].join(''),

	defaults: joint.util.deepSupplement({

		type: 'uml.State',

		attrs: {
			rect: { 'width': 200, 'height': 200, 'fill': '#ecf0f1', 'stroke': '#bdc3c7', 'stroke-width': 3, 'rx': 10, 'ry': 10 },
			path: { 'd': 'M 0 20 L 200 20', 'stroke': '#bdc3c7', 'stroke-width': 2 },
			'.uml-state-name': {
				'ref': 'rect', 'ref-x': .5, 'ref-y': 5, 'text-anchor': 'middle',
				'font-family': 'Courier New', 'font-size': 14, fill: '#000000'
			},
			'.uml-state-events': {
				'ref': 'path', 'ref-x': 5, 'ref-y': 5,
				'font-family': 'Courier New', 'font-size': 14, fill: '#000000'
			}
		},

		name: 'State',
		events: []

	}, joint.shapes.basic.Generic.prototype.defaults),

	initialize: function() {

		_.bindAll(this, 'updateEvents', 'updatePath');

		this.on({
			'change:name': function() { this.updateName(); this.trigger('change:attrs'); },
			'change:events': function() { this.updateEvents(); this.trigger('change:attrs'); },
			'change:size': this.updatePath
		});

		this.updateName();
		this.updateEvents();
		this.updatePath();

		joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
	},

	updateName: function() {
		this.get('attrs')['.uml-state-name'].text = this.get('name');
	},

	updateEvents: function() {
		this.get('attrs')['.uml-state-events'].text = this.get('events').join('\n');
	},

	updatePath: function() {
		this.get('attrs')['path'].d = 'M 0 20 L ' + this.get('size').width + ' 20';
	}

});

joint.shapes.uml.StartState = joint.shapes.basic.Circle.extend({

	defaults: joint.util.deepSupplement({

		type: 'uml.StartState',
		attrs: { circle: { 'fill': '#34495e', 'stroke': '#2c3e50', 'stroke-width': 2, 'rx': 1 }}

	}, joint.shapes.basic.Circle.prototype.defaults)

});

joint.shapes.uml.EndState = joint.shapes.basic.Generic.extend({

	markup: '<g class="rotatable"><g class="scalable"><circle class="outer"/><circle class="inner"/></g></g>',

	defaults: joint.util.deepSupplement({

		type: 'uml.EndState',
		size: { width: 20, height: 20 },
		attrs: {
			'circle.outer': {
				transform: 'translate(10, 10)',
				r: 10,
				fill: 'white',
				stroke: '#2c3e50'
			},

			'circle.inner': {
				transform: 'translate(10, 10)',
				r: 6,
				fill: '#34495e'
			}
		}

	}, joint.shapes.basic.Generic.prototype.defaults)

});

