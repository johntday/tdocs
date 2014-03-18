joint.shapes.sketch = {};
// The following custom shape creates a link out of the whole element.
joint.shapes.sketch.ElementLink = joint.shapes.basic.Rect.extend({
	// Note the `<a>` SVG element surrounding the rest of the markup.
	markup: '<a><g class="rotatable"><g class="scalable"><rect/></g><text/></g></a>',
	defaults: joint.util.deepSupplement({
		type: 'sketch.ElementLink'
	}, joint.shapes.basic.Rect.prototype.defaults),
	link: ''
});
