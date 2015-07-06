module.exports = function trim_string(passedString, charLimit) {
		if(typeof passedString === 'undefined' ) {
			return '';
		}
    var resultString = passedString.substring(0, charLimit);

    if (resultString.length === charLimit) {
        resultString += '...';
    }

    return resultString
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
};