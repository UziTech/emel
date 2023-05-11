const emel = require("../dist/emel.cjs");

describe("emel", () => {
	test("should work without errors", () => {
		const el = emel("div*2");
		expect(el.childNodes[0].nodeType).toBe(Node.ELEMENT_NODE);
		expect(el.childNodes).toHaveLength(2);
	});
});
