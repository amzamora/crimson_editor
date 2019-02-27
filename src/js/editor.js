class CrimsonEditor {
	constructor (anchor) {
		// Initialize editor
		this.him = document.getElementById(anchor);
		this.him.classList.add('CrimsonEditor');
		this.him.innerHTML = '';

		// Attach callbacks to manage input
		this.input = Input(this.him);
		let self = this;
		this.input.addEventListener('keyboard-input', function(e) {
			self._onKeyboardInput(e);
		});
		this.him.addEventListener('click', function(e) {
			self._onClick(e);
		});
	}

	setText(text) {
		Parser.putTextOnEditor(text, this.him);
		this._putCursorOnText();
	}

	insertAtCursor(string) {
		let HTMLelement = this._getElementsWithCursor()[0];
		HTMLelement.element.insertAtCursor(string, HTMLelement);
	}

	setFontSize(new_size) {

	}


	/* Utilities
	   ======== */

	_putCursorOnText() {
		let last_element = this.him.childNodes[this.him.childNodes.length - 1];
		last_element.innerHTML += '<span class="cursor"></span>';
	}

	_getElementsWithCursor() {
		let cursors = document.getElementsByClassName('cursor');
		let elements = []

		for (let cursor of cursors) {
				parent = cursor.parentNode;
				while (!parent.parentNode.classList.contains('CrimsonEditor')) {
					parent = parentElement
				}
				elements.push(parent);
		}

		return elements;
	}


	/* Callbacks
	   ========= */

	_onKeyboardInput(e) {
		// Get element with cursor
		let HTMLelement = this._getElementsWithCursor()[0];

		console.log(e.value);
		switch (e.value) {
			case 'left-key':
				HTMLelement.element.moveCursorLeft(HTMLelement);
				break;

			case 'right-key':
				HTMLelement.element.moveCursorRight(HTMLelement);
				break;

			case 'deletion':
				HTMLelement.element.deleteAtCursor(HTMLelement);
				break;

			case 'new-line':
				this.insertAtCursor('\n');
				break;

			default:
				if (e.value.length === 1) {
					this.insertAtCursor(e.value);
				}
		}
	}

	_onClick(e) {
		this.input.focus ();
	}
}

// TO DO: Explain this
function Input(editor) {
	let input = document.createElement('input');
	input.setAttribute('type', 'text');
	input.classList.add('crimson-editor-input');
	editor.parentElement.appendChild (input);

	document.addEventListener('keydown', function(e) {
		if (input === document.activeElement) {
			let aux = new CustomEvent('keyboard-input');

			if (e.keyCode == 37) {
				aux.value = 'left-key';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 39) {
				aux.value = 'right-key';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 38) {
				aux.value = 'up-key';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 40) {
				aux.value = 'down-key';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 8){
				aux.value = 'deletion';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 13) {
				aux.value = 'new-line';
				input.dispatchEvent(aux);

			}
		}
	});

	input.addEventListener('input', function (e) {
			let aux = new CustomEvent('keyboard-input');
			aux.type = 'input';
			aux.value = input.value;

			input.value = '';

			if (e.inputType !== 'deleteContentBackward') {
				input.dispatchEvent(aux);
			}
	});

	return input;
}
