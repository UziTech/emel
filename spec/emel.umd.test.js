import("../dist/emel.umd.js");

describe("emel", () => {
	test("should work without errors", () => {
		const el = global.emel("div*2");
		expect(el.childNodes[0].nodeType).toBe(Node.ELEMENT_NODE);
		expect(el.childNodes).toHaveLength(2);
	});
});

describe("Emel", () => {
	test("should work without errors", () => {
		const e = new global.emel();
		const el = e.emel("div*2");
		expect(el.childNodes[0].nodeType).toBe(Node.ELEMENT_NODE);
		expect(el.childNodes).toHaveLength(2);
	});
});
