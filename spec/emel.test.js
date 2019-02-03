const emel = require("../src/emel.js");

describe("emel", () => {
	test("should return an element", () => {
		expect(emel().nodeType).toBe(Node.ELEMENT_NODE);
		expect(emel("span").nodeType).toBe(Node.ELEMENT_NODE);
		expect(emel("div{test}").nodeType).toBe(Node.ELEMENT_NODE);
	});

	test("should return an element with 2 children", () => {
		const el = emel("div*2");
		expect(el.nodeType).toBe(Node.ELEMENT_NODE);
		expect(el.children).toHaveLength(2);
	});

	test("should create a plain text node", () => {
		const el = emel("{test}");
		expect(el.nodeType).toBe(Node.TEXT_NODE);
	});

	describe("tag", () => {
		test("should set tag name", () => {
			const el = emel("test");
			expect(el.tagName.toLowerCase()).toBe("test");
		});

		test("should set tag name to div if none given", () => {
			const el = emel("");
			expect(el.tagName.toLowerCase()).toBe("div");
		});
	});

	describe("id", () => {
		test("should set id", () => {
			const el = emel("#test");
			expect(el.id).toBe("test");
		});
	});

	describe("class", () => {
		test("should set class", () => {
			const el = emel(".test");
			expect(el.classList.contains("test")).toBe(true);
		});
	});

	describe("attribute", () => {
		test("should set attribute", () => {
			const el = emel("[test='t']");
			expect(el.getAttribute("test")).toBe("t");
		});

		test("should set boolean attribute", () => {
			const el = emel("[test.]");
			expect(el.getAttribute("test")).toBe("");
		});
	});

	describe("text", () => {
		test("should set textContent", () => {
			const el = emel("span{test}");
			expect(el.textContent).toBe("test");
		});
	});

	describe("children", () => {
		test("should append children", () => {
			const el = emel("span>test*2");
			expect(el.children).toHaveLength(2);
		});
	});
});
