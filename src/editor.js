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


	/* Utlities
	   ======== */

	// Convert a text to crimson elements
	_parseText (text) {
		// Separete paragraphs
		text = text.replace(Paragraph.regex, function (match) {
			return Paragraph.replace (match);
		});

		return text;
	}

	_putCursorOnText () {
		let last_element = this.him.childNodes[this.him.childNodes.length - 2];
		last_element.innerHTML += '<span class="cursor"></span>'
	}


	/* Callbacks
	   ========= */

	_onInput (e) {
		console.log (e);
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
