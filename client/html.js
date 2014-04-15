joint.shapes.html = {};

joint.shapes.html.Element = joint.shapes.basic.Rect.extend({
	defaults: joint.util.deepSupplement({
		type: 'html.Element',
		attrs: {
			rect: { stroke: 'none', 'fill-opacity': 0 }
		}
	}, joint.shapes.basic.Rect.prototype.defaults),
	link:'',title:'',area_code:'',icon:''
});

// Create a custom view for that element that displays an HTML div above it.
// -------------------------------------------------------------------------
joint.shapes.html.ElementView = joint.dia.ElementView.extend({
	template: [
		'<div class="html-element">',
		'<span class="glyphicon"></span>',
		'<label></label>',
		'</div>'
	].join(''),

	initialize: function() {
		_.bindAll(this, 'updateBox');
		joint.dia.ElementView.prototype.initialize.apply(this, arguments);

		this.$box = $(_.template(this.template)());

		this.model.on('change', this.updateBox, this);// Update the box position whenever the underlying model changes.

		this.model.on('remove', this.removeBox, this);// Remove the box when the model gets removed from the graph.

		this.setParms();
		this.updateBox();
	},
	render: function() {
		joint.dia.ElementView.prototype.render.apply(this, arguments);
		this.paper.$el.prepend(this.$box);
		this.updateBox();
		return this;
	},
	updateBox: function() {
		var bbox = this.model.getBBox();// Set the position and dimension of the box so that it covers the JointJS element.
//		this.$box.find('label').text(this.model.get('label'));// Example of updating the HTML with a data stored in the cell model.
//		this.$box.find('a[href]').text(this.model.get('link'));
		this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
	},
	setParms: function() {
		this.$box.find('label').text( this.model.get('title') );
		//this.$box.find('a[href]').val( this.model.get('link')||'#' );
		this.$box.find('div').css({border: '4px solid #2980B9'});//'html-element-' + this.model.get('area_code') );
		this.$box.find('span').addClass( 'glyphicon-'+this.model.get('icon') );
	},
	removeBox: function(evt) {
		this.$box.remove();
	}
});
