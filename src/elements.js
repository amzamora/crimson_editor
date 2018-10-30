function strToRegex (regex) {
	// Replace conflicting characters
	regex = regex.replace(/\//g, '&#x2f;');
	regex = regex.replace(/</g, '&#x3c;');
	regex = regex.replace(/>/g, '&#x3e;');

	// Convert to regex
	regex = new RegExp(regex, "gm");

	return regex;
}

function moveCursorLeft (reference) {
	let text = reference.innerHTML;
	var match = /<span class="cursor"><\/span>/.exec(text);
	text = text.replace ('<span class="cursor"></span>', '');
	text = text.slice(0, match.index - 1) + '<span class="cursor"></span>' + text.slice(match.index - 1);
	reference.innerHTML = text;
}

Paragraph = {
	class: "paragraph",
	regex: strToRegex ('(\n+)?.+\n*'),

	replace: function (match) {
		return `<span class="paragraph">${match}</span>`;
	},
}
