let emmet = require("@emmetio/abbreviation");

/* istanbul ignore next */
if (typeof emmet.default === "function") {
	// fixes webpack including the es module version
	emmet = emmet.default;
}

function createElementFromNode(node) {
	if (node.isTextOnly) {
		return document.createTextNode(node.value);
	}

	const el = document.createElement(node.name || "div");

	if (node.value) {
		el.textContent = node.value;
	}

	node.attributes.forEach(attr => {
		if (attr.options.boolean) {
			el.setAttribute(attr.name, "");
		} else {
			el.setAttribute(attr.name, attr.value);
		}
	});

	node.children
		.map(createElementFromNode)
		.forEach(child => el.appendChild(child));

	return el;
}

module.exports = function (str = "") {
	/* istanbul ignore next */
	if (!document || !document.createElement) {
		throw new Error("Must be in a browser");
	}
	const tree = emmet(str);
	const children = tree.children.map(createElementFromNode);

	return children.reduce((el, child) => {
		el.appendChild(child);
		return el;
	}, document.createDocumentFragment());
};
