const emmet = require("@emmetio/abbreviation");

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

	if (children.length === 1) {
		return children[0];
	}

	return children.reduce((el, child) => {
		el.appendChild(child);
		return el;
	}, document.createElement("div"));
};
