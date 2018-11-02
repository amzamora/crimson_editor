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
				HTMLelement.innerHTML += '<span class="cursor"></span>';
			}
		}
	}

	moveCursorRight (HTMLelement) {
		let text = HTMLelement.innerHTML;
		let match = /<span class="cursor"><\/span>/.exec(text);
		text = text.replace ('<span class="cursor"></span>', '');
		if (text.length !== match.index) {
			text = text.slice(0, match.index + 1) + '<span class="cursor"></span>' + text.slice(match.index + 1);
			HTMLelement.innerHTML = text;

		} else {
			if (HTMLelement.nextSibling) {
				HTMLelement.innerHTML = text;
				HTMLelement = HTMLelement.nextSibling;
				HTMLelement.innerHTML = '<span class="cursor"></span>' + HTMLelement.innerHTML;
			}
		}
	}

	replace (match) {
		return `<span class="${this.class}">${match}</span>`;
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
header1 = new Element ('h1', '^# .+$');

writedown_elements = [];
writedown_elements.push (paragraph);
writedown_elements.push (header1);
