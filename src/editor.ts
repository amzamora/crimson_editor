class CrimsonEditor {
	private him: HTMLElement; // HTML element that represents him in the DOM

	constructor (anchor: string) {
		// Initialize editor
		this.him = document.getElementById (anchor);
		this.him.classList.add ('CrimsonEditor');
		this.him.innerHTML = "";
	}

	// Put some text in the editor
	public setText (text: string) {

		this.him.innerHTML = text;
	}
}
