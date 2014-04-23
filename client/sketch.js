joint.shapes.sketch = {};

joint.shapes.sketch.ElementLink = joint.shapes.basic.Rect.extend({
	// Note the `<a>` SVG element surrounding the rest of the markup.
	markup: '<a><g class="rotatable"><g class="scalable"><rect/><path/></g><text/></g></a>',
	defaults: joint.util.deepSupplement({
		type: 'sketch.ElementLink'
	}, joint.shapes.basic.Rect.prototype.defaults),
	link: ''
});

joint.shapes.sketch.Interface = joint.shapes.basic.Circle.extend({
	markup: '<a><g class="rotatable"><text/><g class="scalable"><circle/></g></g></a>',
	defaults: joint.util.deepSupplement({
		type: 'sketch.Interface'
	}, joint.shapes.basic.Circle.prototype.defaults),
	link: ''
});

joint.shapes.sketch.Legend = joint.shapes.basic.Generic.extend({
	markup: '<g><g><rect/></g><path/><text class="sketch-legend-name"/></g>',
	defaults: joint.util.deepSupplement({
		type: 'sketch.Legend',
		attrs: {
			rect: { 'width': 200, 'height': 200, 'fill': '#ecf0f1', 'stroke': '#bdc3c7', 'stroke-width': 3, 'rx': 10, 'ry': 10 },
			path: { 'd': 'M 0 20 L 200 20', 'stroke': '#bdc3c7', 'stroke-width': 2 },
			'.sketch-legend-name': {
				'ref': 'rect', 'ref-x': .5, 'ref-y': 5, 'text-anchor': 'middle',
				'font-family': 'Courier New', 'font-size': 14, fill: '#000000'
			}
		},
		name: 'Legend'
	}, joint.shapes.basic.Generic.prototype.defaults),
	
	initialize: function() {
		_.bindAll(this, 'updatePath');

		this.on({
			'change:size': this.updatePath
		});

		this.updatePath();
		joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
	},
	updatePath: function() {
		this.get('attrs')['path'].d = 'M 0 20 L ' + this.get('size').width + ' 20';
	}
});

joint.shapes.sketch.Group = joint.shapes.basic.Generic.extend({
	markup: '<a><g class="rotatable"><g class="scalable"><rect/></g><path/><text class="sketch-group-name"/></g></a>',
	defaults: joint.util.deepSupplement({
		type: 'sketch.Group',
		attrs: {
			rect: { 'width': 200, 'height': 200, 'fill': '#ecf0f1', 'stroke': '#bdc3c7', 'stroke-width': 3, 'rx': 10, 'ry': 10 },
			path: { 'd': 'M 0 20 L 200 20', 'stroke': '#bdc3c7', 'stroke-width': 2 },
			'.sketch-group-name': {
				'ref': 'rect', 'ref-x': .5, 'ref-y': 5, 'text-anchor': 'middle',
				'font-family': 'Courier New', 'font-size': 14, fill: '#000000'
			},
			custom: {}
		},
		name: 'Group'
	}, joint.shapes.basic.Generic.prototype.defaults),
	link:'',
	
	initialize: function() {
		_.bindAll(this, 'updatePath');
		
		this.on({
//			'change:name': function() { this.updateName(); this.trigger('change:attrs'); },
			'change:size': this.updatePath
		});
		
		//this.updateName();
		this.updatePath();
		joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
	},
//	updateName: function() {
//		this.get('attrs')['.sketch-group-name'].text = this.get('name');
//	},
	updatePath: function() {
		this.get('attrs')['path'].d = 'M 0 20 L ' + this.get('size').width + ' 20';
	}
});

joint.shapes.sketch.Service = joint.shapes.basic.Rect.extend({
	markup: '<a><g class="rotatable"><g class="scalable"><rect/></g><text/></g></a>',
	defaults: joint.util.deepSupplement({
		type: 'sketch.Service'
	}, joint.shapes.basic.Rect.prototype.defaults),
	link:'',

	initialize: function() {
		_.bindAll(this, 'updatePath');

		this.on({
			'change:size': this.updatePath
		});

		this.updatePath();
		joint.shapes.basic.Rect.prototype.initialize.apply(this, arguments);
	},
	updatePath: function() {
		this.get('attrs')['rect'].rx = this.get('size').height / 2.0;
		this.get('attrs')['rect'].ry = this.get('size').height / 2.0;
	}
});

joint.shapes.sketch.Data = joint.shapes.basic.Generic.extend({
	markup: '<a><g class="rotatable"><g class="scalable"><rect/></g><path/><text/></g></a>',
	defaults: joint.util.deepSupplement({
		type: 'sketch.Data',
		attrs: {
			rect: { 'width': 200, 'height': 200 },
			path: { 'd': 'M 0 10 L 200 10' },
			text: {
				'ref': 'rect', 'ref-x': .5, 'ref-y': 15, 'text-anchor': 'middle'
			}
		}
	}, joint.shapes.basic.Generic.prototype.defaults),
	link:'',

	initialize: function() {
		_.bindAll(this, 'updatePath');

		this.on({
			'change:size': this.updatePath
		});

		this.updatePath();
		joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
	},
	updatePath: function() {
		this.get('attrs')['path'].d = 'M 0 10 L ' + this.get('size').width + ' 10';
	}
});
