class TypoEditor {
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
		window.addEventListener('resize', function(e) {
			for (let child of self.him.children) {
				self._wrapText(child);
			}
		});
	}

	setText(text) {
		this.him.innerHTML = '';
		Parser.put_text_on_editor(text, this.him);

		for (let child of this.him.children) {
			this._wrapText(child);
		}

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

	/* Private
	   ======= */

	_wrapText(element) {
		element.innerHTML = element.innerHTML.replace(/<br>/g, ' ');

		let clone = element.cloneNode(false);
		clone.style.display = "inline-block";
		this.him.appendChild(clone);

		let words = element.innerHTML.split(' ');
		clone.innerHTML += words.shift();
		for (let word of words) {
			if (word.length === 0) {
				clone.innerHTML += ' ';
			} else {
				clone.innerHTML += ' ' + word;
			}

			if (element.clientWidth < clone.clientWidth) {
				// Find previos inserted ' ' and replace it with <br>
				let i = clone.innerHTML.length;
				while (i > 0) {
					if (clone.innerHTML[i] === ' ') {
						clone.innerHTML = clone.innerHTML.substr(0, i) + '<br>' + clone.innerHTML.substr(i + 1);
						break;
					}
					i--;
				}
			}
		}

		element.innerHTML = clone.innerHTML;
		this.him.removeChild(clone);
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

			case 'up-key':
				this.cursor.moveUp();
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
					this.cursor.elementWithCursor.innerHTML = this.cursor.elementWithCursor.innerHTML.replace(/<br>/g, ' ');
					this._wrapText(this.cursor.elementWithCursor);
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
