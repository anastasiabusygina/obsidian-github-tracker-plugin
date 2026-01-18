/**
 * Decode HTML entities in a string
 * @param text The string containing HTML entities
 * @returns The decoded string
 */
function decodeHtmlEntities(text: string): string {
	// Decode hex entities like &#x3D; (=) and &#x3A; (:)
	text = text.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

	// Decode decimal entities like &#39; (')
	text = text.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));

	// Decode named entities
	const namedEntities: Record<string, string> = {
		'&apos;': "'",
		'&quot;': '"',
		'&lt;': '<',
		'&gt;': '>',
		'&amp;': '&'
	};

	for (const [entity, char] of Object.entries(namedEntities)) {
		text = text.replace(new RegExp(entity, 'g'), char);
	}

	return text;
}

/**
 * Utility function for escaping content in different modes
 * @param unsafe The string to escape
 * @param mode The escaping mode: "disabled", "normal", or "strict"
 * @returns The escaped string
 * @throws Error if input is null or undefined
 */
export function escapeBody(unsafe: string, mode: "disabled" | "normal" | "strict" | "veryStrict" = "normal"): string {
	if (unsafe === null || unsafe === undefined) {
		throw new Error("Input cannot be null or undefined");
	}

	// Decode HTML entities first (before any other processing)
	unsafe = decodeHtmlEntities(unsafe);

	if (mode === "disabled") {
		return unsafe;
	}
	
	if (mode === "strict") {
        //remove all characters that are not a-z, A-Z, 0-9, or whitespace
		return unsafe.replace(/[^a-zA-Z0-9\s.,()/[\]*+-:"#!'?&|*>~^]/g, "").replace(/---/g, "- - -");
	}

    if (mode === "veryStrict") {
        //remove all characters that are not a-z, A-Z, 0-9, or whitespace
		return unsafe.replace(/[^a-zA-Z0-9\s.,?]/g, "");
	}
	
	// normal mode
	return unsafe
		.replace(/<%/g, "'<<'")
		.replace(/%>/g, "'>>'")
		.replace(/`/g, '"')
		.replace(/---/g, "- - -")
        .replace(/{{/g, "((")
        .replace(/}}/g, "))");
} 