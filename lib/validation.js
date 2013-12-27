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
		throwError('Please add "' + fieldLabel + '" more than ' + (minChars-1) + ' characters, and less than ' + maxChars);
		return true;
	}
	return false;
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
	var hasInputError = validateFieldLength(tdoc.title, 'Title', 10, 128)
		|| validateFieldLength(tdoc.abstract, 'Abstract', 10, 2048);

	return hasInputError;
};
// Transform tdoc before save.
transformTdoc = function(tdoc) {
	return tdoc;
};
