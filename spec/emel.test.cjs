const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const emel = require("../dist/emel.cjs");

describe("emel", () => {
	test("should work without errors", () => {
		const el = emel("div*2");
		assert.equal(el.childNodes[0].nodeType, Node.ELEMENT_NODE);
		assert.equal(el.childNodes.length, 2);
	});
});

describe("Emel", () => {
	test("should work without errors", () => {
		const e = new emel();
		const el = e.emel("div*2");
		assert.equal(el.childNodes[0].nodeType, Node.ELEMENT_NODE);
		assert.equal(el.childNodes.length, 2);
	});
});
