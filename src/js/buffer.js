Text = {
	ORIGINAL: 0,
	ADDED: 1
}

class Piece {
	constructor(type, start, length) {
		this.type = type;
		this.start = start;
		this.length = length;
	}
}

class Buffer {
	constructor(text = "") {
		this._original = text;
		this._added = "";
		this._pieces = [];
	}

	insertAt(offset, text) {
		if (offset < 0 || offset > this.getText().length) {
			throw new Error("Offset provided in _insertAt() is invalid.")
		}

		if (this._pieces.length !== 0) {
			// Get piece affected by insertion
			let affected = this._getPieceOnOffset(offset);

			let relativeOffset = offset - affected.offset;

			// If something is added at start of the piece
			if (relativeOffset === 0) {
				let newPiece = new Piece(Text.ADDED, this._added.length, text.length);
				this._added += text;
				this._pieces.splice(affected.index, 0, newPiece);

			// If something is added in the middle
			} else if (relativeOffset < affected.length) {
				let originalLength = affected.length;

				// Change affected piece to be first half
				this._pieces[affected.index].length = relativeOffset;

				// Create middle piece
				let newPiece = new Piece(Text.ADDED, this._added.length, text.length);
				this._added += text;
				this._pieces.splice(affected.index + 1, 0, newPiece);

				// Create second half
				let second = new Piece(affected.type, affected.start + relativeOffset, originalLength - relativeOffset);
				this._pieces.splice(affected.index + 2, 0, second);


			// If something is added at the end
			} else {
				// If the new text is continuos with the piece
				if (affected.type === Text.ADDED && affected.start + affected.length === this._added.length) {
					this._added += text;
					this._pieces[affected.index].length += text.length;
				} else {
					let newPiece = new Piece(Text.ADDED, this._added.length, text.length);
					this._added += text;
					this._pieces.splice(affected.index + 1, 0, newPiece);
				}
			}

		// If there are no pieces
		} else {
			let newPiece = new Piece(Text.ADDED, this._added.length, text.length);
			this._added += text;
			this._pieces.push(newPiece);
		}
	}


	delete() {

	}

	undo() {

	}

	redo() {

	}

	getText() {
		let text = "";
		for (let piece of this._pieces) {
			if (piece.type === Text.ORIGINAL) {
				text += this._original.substr(piece.start, piece.length);
			} else {
				text += this._added.substr(piece.start, piece.length);
			}
		}

		return text;
	}

	setText(text) {
		let newPiece = new Piece(Text.ORIGINAL, 0, text.length);
		this._original = text;
		this._pieces.push(newPiece);
	}

	// Private
	// -------

	// Returns a piece with some extra info on it
	_getPieceOnOffset(offset) {
		let pieceIndex = 0;
		let pieceOffset = 0;
		for (let piece of this._pieces) {
			if (pieceOffset <= offset && offset <= pieceOffset + piece.length) {
				let copy = JSON.parse(JSON.stringify(piece));
				copy.offset = pieceOffset; // Extra info
				copy.index = pieceIndex;   // Extra info
				return copy;
			}
			pieceOffset += piece.length;
			pieceIndex += 1;
		}

		return undefined; // That json stuff is to return a copy and not a reference
	}
}
