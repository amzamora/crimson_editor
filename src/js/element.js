/* Base behaviour for elements on the editor */

class Element {
	moveCursorLeft(HTMLelement) {
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

	moveCursorRight(HTMLelement) {
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

	insertAtCursor(string,  HTMLelement) {
		HTMLelement.innerHTML = HTMLelement.innerHTML.replace('<span class="cursor"></span>', string + '<span class="cursor"></span>');
	}

	deleteAtCursor(HTMLelement) {
		let text = HTMLelement.innerHTML;
		let match = /<span class="cursor"><\/span>/.exec(text);

		if (match.index !== 0) {
			text = text.slice(0, match.index - 1) + text.slice(match.index);
			HTMLelement.innerHTML = text;

		}
	}
}
