class CrimsonEditor {
	constructor (anchor) {
		// Initialize editor
		this.him = document.getElementById (anchor);
		this.him.classList.add ("CrimsonEditor");
		this.him.innerHTML = '';
	}

	setText (text) {
		this.him.innerHTML = text;
	}
}
