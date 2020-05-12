let emmet = require("@emmetio/abbreviation");

/* istanbul ignore next */
if (typeof emmet.default === "function") {
	// fixes webpack including the es module version
	emmet = emmet.default;
}

function format(value, placeholders) {
	if (Array.isArray(value)) {
		value = value[0];
	}
	if (placeholders[value]) {
		const placeholder = placeholders[value];
		if (Array.isArray(placeholder)) {
			if (placeholder.length > 0) {
				value = placeholder.shift();
			}
		} else {
			value = placeholder;
		}
	}
	return value;
}

function createElementFromNode(placeholders) {
	return (node) => {
		if (node.value && !node.name && !node.attributes && node.children.length === 0) {
			return document.createTextNode(format(node.value, placeholders));
		}

		const el = document.createElement(format(node.name || "div", placeholders));

		if (node.attributes) {
			node.attributes.forEach(attr => {
				if (attr.boolean || typeof attr.value === "undefined") {
					el.setAttribute(format(attr.name, placeholders), "");
				} else if (["id", "class"].includes(attr.name)) {
					el.setAttribute(attr.name, format(attr.value, placeholders));
				} else {
					el.setAttribute(format(attr.name, placeholders), format(attr.value, placeholders));
				}
			});
		}

		if (node.value) {
			el.textContent = format(node.value, placeholders);
		}

		node.children
			.map(createElementFromNode(placeholders))
			.forEach(child => el.appendChild(child));

		return el;
	};
}

const defaultOptions = {
	placeholders: {},
};

function getOptions(opts) {
	const options = {...defaultOptions, ...opts};

	if (opts.placeholders) {
		if (typeof options.placeholders === "string" || Array.isArray(options.placeholders)) {
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
	const tree = emmet(str);
	const children = tree.children.map(createElementFromNode(options.placeholders));

	return children.reduce((el, child) => {
		el.appendChild(child);
		return el;
	}, document.createDocumentFragment());
}

module.exports = emel;
