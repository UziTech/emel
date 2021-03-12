let emmet = require("@emmetio/abbreviation");

/* istanbul ignore next */
if (typeof emmet.default === "function") {
	// fixes webpack including the es module version
	emmet = emmet.default;
}

function format(value, placeholders, isAttrName = false) {
	if (Array.isArray(value)) {
		value = value[0];
	}
	const origValue = value;
	if (value in placeholders) {
		const placeholder = placeholders[value];
		if (Array.isArray(placeholder)) {
			if (placeholder.length > 0) {
				value = placeholder.shift();
			}
		} else {
			value = placeholder;
		}
	}

	if (isAttrName) {
		if (value === false || value === null || typeof value === "undefined") {
			return false;
		} else if (value === true) {
			return origValue;
		}
	}

	return value;
}

function createElementFromNode(placeholders) {
	return (node) => {
		if (node.value && !node.name && !node.attributes && node.children.length === 0) {
			return document.createTextNode(format(node.value, placeholders));
		}

		const tag = format(node.name || "div", placeholders);
		const el = tag instanceof Node ? tag : document.createElement(tag);

		if (node.attributes) {
			node.attributes.forEach(attr => {
				if (attr.boolean || typeof attr.value === "undefined") {
					const name = format(attr.name, placeholders, true);
					if (name !== false) {
						el.setAttribute(name, "");
					}
				} else if (["id", "class"].includes(attr.name)) {
					el.setAttribute(attr.name, format(attr.value, placeholders));
				} else {
					const name = format(attr.name, placeholders, true);
					const value = format(attr.value, placeholders);
					if (name !== false) {
						el.setAttribute(name, value);
					}
				}
			});
		}

		if (node.value) {
			const text = format(node.value, placeholders);
			if (text instanceof Node) {
				el.appendChild(text);
			} else {
				el.textContent = text;
			}
		}

		node.children
			.map(createElementFromNode(placeholders))
			.forEach(child => el.appendChild(child));

		return el;
	};
}

const defaultOptions = {
	multiline: false,
	placeholders: {},
};

function isPlaceholderObject(obj) {
	return (
		typeof obj === "string" ||
		typeof obj === "number" ||
		typeof obj === "boolean" ||
		Array.isArray(obj) ||
		obj instanceof Node
	);
}

function getOptions(opts) {
	if (isPlaceholderObject(opts)) {
		opts = {placeholders: { "?": opts}};
	}
	const options = {...defaultOptions, ...opts};

	if ("placeholders" in opts) {
		if (isPlaceholderObject(options.placeholders)) {
			options.placeholders = {
				"?": options.placeholders,
			};
		} else {
			options.placeholders = {...options.placeholders};
		}
		for (const prop in options.placeholders) {
			if (Array.isArray(options.placeholders[prop])) {
				options.placeholders[prop] = [...options.placeholders[prop]];
			}
		}
	}

	return options;
}

function emel(str = "", options = {}) {
	options = getOptions(options);
	/* istanbul ignore next */
	if (!document || !document.createElement) {
		throw new Error("Must be in a browser");
	}
	if ("?" in options.placeholders) {
		// escape unescaped questionmarks
		str = str.replace(/(^|[^\\])(\\\\)*\?/g, "$1$2\\?");
	}
	if (options.multiline) {
		str = str.replace(/\s*?\n\s*/g, "");
	}
	const tree = emmet(str);
	const children = tree.children.map(createElementFromNode(options.placeholders));

	return children.reduce((el, child) => {
		el.appendChild(child);
		return el;
	}, document.createDocumentFragment());
}

module.exports = emel;
