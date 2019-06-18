class CrimsonEditor {
	constructor (anchor) {
		// Initialize editor
		this.him = document.getElementById(anchor);
		this.him.classList.add('CrimsonEditor');
		this.him.innerHTML = '';
		this.cursor = new Cursor(this.him);

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
		Parser.put_text_on_editor(text, this.him);

		let lines = this.getText().split('\n');
		this.cursor.setPosition(); // setPosition(element, offset);

	}

	setFontSize(new_size) {

	}

	getText() {
		let text = "";
		for (let child of this.him.childNodes) {
			text += child.innerHTML;
		}
		return text;
	}


	/* Callbacks
		 ========= */

	_onKeyboardInput(e) {
		switch (e.value) {
			case 'left-key':
				this.cursor.moveLeft();
				break;

			case 'right-key':
				this.cursor.moveRight();
				break;

			case 'deletion':
				this.cursor.deleteAtCursor();
				break;

			case 'new-line':
				this.cursor.insertAtCursor('\n');
				break;

			default:
				if (e.value.length === 1) {
					this.cursor.insertAtCursor(e.value);
				}
				break;
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
