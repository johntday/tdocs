Template.featureComparison.tables = function () {
	return EA_Relationships;
};

var checkOrX = function (value) {
	var html;
	// first, normalize the value to a canonical interpretation
	if (typeof value === 'boolean')
		value = {
			support: value
		};

	if (value === null || value === undefined) {
		html = '<span style="color: orange; font-weight: bold">?</span>';
	} else {
		if (value.support === true)
			html = '<span style="color: green">&#10004;</span>'
		else if (value.support === false)
			html = '<span style="color: red">&#10008;</span>';
		else
			html = '<span style="color: lightblue">' + value.support + '</span>';
		if (value.link)
			html += ' (<a href="' + value.link + '">more</a>)';
	}
	return new Spacebars.SafeString(html);
};

Template.featureComparison.tableSettings = function () {
	return {
		rowsPerPage: 5,
		showNavigation: 'auto',
		fields: [
			{ key: 'rel_name', label: 'rel_name' },
			{ key: 'source', label: 'source' },
			{ key: 'semantic', label: 'semantic' },
			{ key: 'target', label: 'target' }
		]
	};
};
