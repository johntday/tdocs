var codeDep = new Deps.Dependency();
var codeValue;
var codeInterval;
var _id;

function getCodeInputValue() {
	var currentCodeValue = $('#code').val();
	//console.log("currentCodeValue: ["+currentCodeValue+"]");
	if ( Session.get('form_update') && (currentCodeValue != codeValue) && !isError() ) {
		console.log("currentCodeValue != codeValue");
		codeValue = currentCodeValue;

		Diagrams.update(_id, {$set: {code: currentCodeValue}} );

		codeDep.changed();
	}
};

function isError() {
	try {
		Diagram.parse( codeValue || $('#code').val() );
	} catch (err) {
		return true;
	}
	return false;
};

Template.tmpl_diagram_diagram.created = function() {
	codeInterval = Meteor.setInterval(getCodeInputValue, 10000);
};

//function code() {
//	codeDep.depend(); // !!!
//	return codeValue || $('#code').val();
//};

Template.tmpl_diagram_diagram.destroyed = function() {
	Meteor.clearInterval(codeInterval);
};

/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_diagram_diagram.rendered = function() {
	//console.log("template this.data.obj._id:"+JSON.stringify(this.data.obj._id));
	_id = this.data.obj._id;

	codeValue = codeValue || $('#code').val();
	var diagram = Diagram.parse( codeValue );
	diagram.drawSVG('diagram');
};

