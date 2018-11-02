class Element {
	constructor (cls, regex) {
		this.class = cls
		this.regex = Element._strToRegex (regex);

	}

	moveCursorLeft (HTMLelement) {
		let text = HTMLelement.innerHTML;
		let match = /<span class="cursor"><\/span>/.exec(text);
		if (match.index != 0) {
			text = text.replace ('<span class="cursor"></span>', '');
			text = text.slice(0, match.index - 1) + '<span class="cursor"></span>' + text.slice(match.index - 1);
			HTMLelement.innerHTML = text;

		} else {
			// Put cursor at the end of previous element
			if (HTMLelement.previousSibling) {
				HTMLelement.innerHTML = text.replace ('<span class="cursor"></span>', '');
				HTMLelement = HTMLelement.previousSibling;
				text = HTMLelement.innerHTML;
				text = text.substring(0, text.length-1) + '<span class="cursor"></span>' + '\n';
				HTMLelement.innerHTML = text;
			}
		}
	}

	moveCursorRight (HTMLelement) {
		let text = HTMLelement.innerHTML;
		let match = /<span class="cursor"><\/span>/.exec(text);
		if (match.index !== text.length - 29 && HTMLelement.nextSibling) {
			text = text.replace ('<span class="cursor"></span>', '');
			text = text.slice(0, match.index + 1) + '<span class="cursor"></span>' + text.slice(match.index + 1);
			HTMLelement.innerHTML = text;

		} else {
			if (HTMLelement.nextSibling) {
				HTMLelement.innerHTML = text.replace ('<span class="cursor"></span>', '');
				HTMLelement = HTMLelement.nextSibling;
				HTMLelement.innerHTML = '<span class="cursor"></span>' + HTMLelement.innerHTML;

			} else {
				text = text.replace ('<span class="cursor"></span>', '');
				text = text.slice(0, match.index + 1) + '<span class="cursor"></span>' + text.slice(match.index + 1);
				HTMLelement.innerHTML = text;
			}
		}
	}

	replace (match) {
		return `<span class="paragraph">${match}</span>`;
	}

	static _strToRegex (regex) {
		// Replace conflicting characters
		regex = regex.replace(/\//g, '&#x2f;');
		regex = regex.replace(/</g, '&#x3c;');
		regex = regex.replace(/>/g, '&#x3e;');

		// Convert to regex
		regex = new RegExp(regex, "gm");

		return regex;
	}
}

paragraph = new Element ('paragraph', '(\n+)?.+\n*');

writedown_elements = [];
writedown_elements.push (paragraph);
