import emmet from "@emmetio/abbreviation";

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

function createElementFromNode(options) {
	return (node) => {
		if (node.value && !node.name && !node.attributes && node.children.length === 0) {
			return options.doc.createTextNode(format(node.value, options.placeholders));
		}

		const tag = format(node.name || "div", options.placeholders);

		const el = tag instanceof Node ? tag : options.doc.createElement(tag);

		if (node.attributes) {
			node.attributes.forEach(attr => {
				if (attr.boolean || typeof attr.value === "undefined") {
					const name = format(attr.name, options.placeholders, true);
					if (name !== false) {
						el.setAttribute(name, "");
					}
				} else {
					const resolveAttrVal = () => format(attr.value, options.placeholders);

					switch (attr.name) {
						case "id":
							el.setAttribute(attr.name, resolveAttrVal());
							break;

						case "class":
							el.classList.add(resolveAttrVal());
							break;

						default: {
							const name = format(attr.name, options.placeholders, true);
							const value = resolveAttrVal();

							if (name !== false) {
								el.setAttribute(name, value);
							}
						}
					}
				}
			});
		}

		if (node.value) {
			const text = format(node.value, options.placeholders);
			if (text instanceof Node) {
				el.appendChild(text);
			} else {
				el.textContent = text;
			}
		}

		node.children
			.map(createElementFromNode(options))
			.forEach(child => el.appendChild(child));

		return el;
	};
}

const defaultOptions = {
	returnSingleChild: false,
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

function getOptions(opts, defaults = defaultOptions) {
	if (isPlaceholderObject(opts)) {
		opts = { placeholders: { "?": opts } };
	}
	const options = { ...defaults, ...opts };

	if ("placeholders" in opts) {
		if (isPlaceholderObject(options.placeholders)) {
			options.placeholders = {
				"?": options.placeholders,
			};
		} else {
			options.placeholders = { ...options.placeholders };
		}
		for (const prop in options.placeholders) {
			if (Array.isArray(options.placeholders[prop])) {
				options.placeholders[prop] = [...options.placeholders[prop]];
			}
		}
	}

	if (!options.doc) {
		options.doc = document;
	}

	return options;
}

export default function emel(str = "", options = {}) {

	if (this instanceof emel) {
		let opts = defaultOptions;
		if (str && typeof str === "object") {
			opts = getOptions(str);
		}
		this.emel = (s = "", o = {}) => {
			return emel(s, getOptions(o, opts));
		};
		return;
	}

	options = getOptions(options);

	if ("?" in options.placeholders) {
		// escape unescaped questionmarks
		str = str.replace(/(^|[^\\])(\\\\)*\?/g, "$1$2\\?");
	}
	if (options.multiline) {
		str = str.replace(/\s*?\n\s*/g, "");
	}
	const tree = emmet(str);
	const children = tree.children.map(createElementFromNode(options));

	if (options.returnSingleChild && children.length === 1) {
		return children[0];
	}

	return children.reduce((el, child) => {
		el.appendChild(child);
		return el;
	}, options.doc.createDocumentFragment());
}
