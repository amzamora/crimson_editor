class Parser {
	static stylize(text) {
		// Remove unnecesary new lines
		text = text.replace(/\n\n+/g, '\n');

		return text;
	}
}
