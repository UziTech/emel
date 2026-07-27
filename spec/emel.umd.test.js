import { describe, test } from "node:test";
import assert from "node:assert/strict";

import("../dist/emel.umd.js");

describe("emel", () => {
	test("should work without errors", () => {
		const el = global.emel("div*2");
		assert.equal(el.childNodes[0].nodeType, Node.ELEMENT_NODE);
		assert.equal(el.childNodes.length, 2);
	});
});

describe("Emel", () => {
	test("should work without errors", () => {
		const e = new global.emel();
		const el = e.emel("div*2");
		assert.equal(el.childNodes[0].nodeType, Node.ELEMENT_NODE);
		assert.equal(el.childNodes.length, 2);
	});
});
