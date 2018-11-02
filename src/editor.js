class CrimsonEditor {
	constructor (anchor) {
		// Initialize editor
		this.him = document.getElementById (anchor);
		this.him.classList.add ("CrimsonEditor");
		this.him.innerHTML = '';

		// Set event listeners
		this.input = Input (this.him);

		let self = this;
		this.input.addEventListener ('keyboard-input', function (e) {
			self._onInput (e);
		});
		this.him.addEventListener ('click', function (e) {
			self._onClick (e);
		});
	}

	setText (text) {
		this.him.innerHTML = this._parseText (text);

		// Put cursor at the end
		this._putCursorOnText ();
	}

	insertAtCursor () {

	}

	setFontSize (new_size) {

	}


	/* Utilities
	   ======== */

	// Convert a text to crimson elements
	_parseText (text) {
		// Separete paragraphs
		text = text.replace(paragraph.regex, function (match) {
			return paragraph.replace (match);
		});

		return text;
	}

	_putCursorOnText () {
		let last_element = this.him.childNodes[this.him.childNodes.length - 1];
		last_element.innerHTML += '<span class="cursor"></span>';
	}

	_getElementsWithCursor () {
		let cursors = document.getElementsByClassName('cursor');
		let elements = []

		for (let cursor of cursors) {
				parent = cursor.parentNode;
				while (!parent.parentNode.classList.contains ("CrimsonEditor")) {
					parent = parentElement
				}
				elements.push (parent);
		}

		return elements;
	}


	/* Callbacks
	   ========= */

	_onInput (e) {
		if (e.value.length > 1) { // If a special key is pressed
			// Get element with cursor
			let HTMLelement = this._getElementsWithCursor()[0];

			// Find what type of element is
			let writedown_element = undefined;
			for (let element of writedown_elements) {
				if (HTMLelement.classList.contains (element.class)) {
					writedown_element = element;
				}
			}

			switch (e.value) {
				case "left-key":
					writedown_element.moveCursorLeft (HTMLelement);
					break;

				case "right-key":
					writedown_element.moveCursorRight (HTMLelement);
					break;
			}
		}
	}

	_onClick (e) {
		this.input.focus ();
	}
}


function Input (editor) {
	let input = document.createElement ('input');
	input.setAttribute ('type', 'text');
	input.classList.add ('crimson-editor-input');
	editor.parentElement.appendChild (input);

	document.addEventListener ('keydown', function(e) {
		if (input === document.activeElement) {
			let aux = new CustomEvent ('keyboard-input');

			if (e.keyCode == 37) {
				aux.value = 'left-key';
				input.dispatchEvent (aux);

			} else if (e.keyCode == 39) {
				aux.value = 'right-key';
				input.dispatchEvent (aux);

			} else if (e.keyCode == 38) {
				aux.value = 'up-key';
				input.dispatchEvent (aux);

			} else if (e.keyCode == 40) {
				aux.value = 'down-key';
				input.dispatchEvent (aux);
			}
		}
	});

	input.addEventListener ('input', function (e) {
			let aux = new CustomEvent ('keyboard-input');
			aux.type = 'input';
			aux.value = e.data;
			input.dispatchEvent (aux);
	});

	return input;
}
