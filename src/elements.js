class Header {
	constructor () {
		this.blockElement = true;
		this.him =
	}

	static regex () {
		let regex = "^# .+$";

		// Replace conflicting characters
		regex = regex.replace(/\//g, '&#x2f;');
		regex = regex.replace(/</g, '&#x3c;');
		regex = regex.replace(/>/g, '&#x3e;');

		// Convert to regex
		regex = new RegExp(lang[key].regex, "gm");

		return regex;
	}
}
