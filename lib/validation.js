/**
 * GENERIC FUNCTIONS
 */
isIntegerBetween = function(value, low, high) {
	var isInt = Match.test(parseInt( value ), Match.Integer);
	if (!isInt)
		return false;

	return (value > low && value < high);
};
validateFieldLength = function(field, fieldLabel, minChars, maxChars) {
	if (! field) {
		throwError('Please add "' + fieldLabel + '"');
		return true;
	}
	if (field.length < minChars || field.length > maxChars) {
		throwError('Please add "' + fieldLabel + '" at least ' + minChars + ' characters, and less than ' + maxChars);
		return true;
	}
	return false;
};
checkFieldLength = function(fieldName, fieldValue, minChars, maxChars) {
	if (! fieldValue || !_.isString(fieldValue) || fieldValue.length < minChars || fieldValue.length > maxChars) {
		return fieldName + ' must be more than ' + (minChars-1) + ' characters, and less than ' + maxChars;
	}
};
checkTitle = function(value) {
	return checkFieldLength('"Title"', value, 10, 128);
};
checkDescription = function(value) {
	return checkFieldLength('"Description"', value, 10, 2048);
};
validatePersonName = function(name) {
	if (name) {
		var nameArray = name.split(" ", 4);
		if (nameArray.length > 1) {/*more than 1 word*/
			for (var i=0; i < nameArray.length; i++) {
				if (nameArray[i].length > 2)/*each word has more than 2 chars*/
					return false;
			}
		}
	}
	throwError('Please enter valid name (e.g. "Mary Poppins")');
	return true;
};
isSeqDiagramParseError = function(code) {
	try {
		Diagram.parse( code );
	} catch (err) {
		throwError('Your sequence diagram text has a problem');
		return true;
	}
	return false;
};
isLoggedIn = function() {
	if(!Meteor.user()){
		throwError('You must login to update a tdoc');
		return true;
	}
	return false;
};
checkForDupOnServer = function(Collection, fieldName, fieldValue, current_id) {
	var selector = {};
	selector[fieldName] = {$regex: RegExp.quote(fieldValue), $options: 'i'};
	if (current_id)
		selector['_id'] = {$ne: current_id};
	var item = Collection.findOne( selector );
	if ( item )
		return true;
	return false;
};
//-------------------------------------------------------------------------------------------------------------------
/**
 * VALIDATE PERSON
 */
validatePerson = function(person) {
	var hasInputError = validatePersonName(person.name);
	return hasInputError;
};
// Transform person before save.
transformPerson = function(person) {
	return person;
};

/**
 * VALIDATE Tdoc
 */
validateTdoc = function(tdoc) {
	var hasInputError = isLoggedIn()
		|| validateFieldLength(tdoc.title, 'Title', 3, 128);
		//|| validateFieldLength(tdoc.description, 'Description', 10, 2048);
	return hasInputError;
};
// Transform tdoc before save.
transformTdoc = function(tdoc) {
	return tdoc;
};

/**
 * VALIDATE Diagram
 */
validateDiagram = function(diagram) {
	var hasInputError = validateFieldLength(diagram.title, 'Title', 3, 128)
		//|| validateFieldLength(diagram.description, 'Description', 10, 2048)
		|| isSeqDiagramParseError(diagram.code);
	return hasInputError;
};
// Transform diagram before save.
transformDiagram = function(diagram) {
	return diagram;
};

/**
 * VALIDATE Glossary
 */
validateGlossary = function(glossary, _id) {
	var hasInputError = validateFieldLength(glossary.title, 'Title', 2, 128)
		|| validateFieldLength(glossary.description, 'Description', 10, 4048);
	return hasInputError;
};
// Transform glossary before save.
transformGlossary = function(glossary) {
	return glossary;
};

/**
 * VALIDATE Table
 */
validateTable = function(table, _id) {
	var hasInputError = validateFieldLength(table.title, 'Title', 3, 128)
	//|| validateFieldLength(diagram.description, 'Description', 10, 2048)
	return hasInputError;
};
// Transform table before save.
transformTable = function(table) {
	return table;
};
