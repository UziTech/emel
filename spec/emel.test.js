const emel = require("../src/emel.js");

describe("emel", () => {
	test("should return a document fagment", () => {
		expect(emel().nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
		expect(emel("span").firstChild.nodeType).toBe(Node.ELEMENT_NODE);
		expect(emel("div{test}").firstChild.nodeType).toBe(Node.ELEMENT_NODE);
	});

	test("should return an element with 2 children", () => {
		const el = emel("div*2");
		expect(el.firstChild.nodeType).toBe(Node.ELEMENT_NODE);
		expect(el.childNodes).toHaveLength(2);
	});

	test("should create a plain text node", () => {
		const el = emel("{test}");
		expect(el.firstChild.nodeType).toBe(Node.TEXT_NODE);
		expect(el.firstChild.textContent).toBe("test");
	});

	describe("tag", () => {
		test("should set tag name", () => {
			const el = emel("test");
			expect(el.firstChild.tagName.toLowerCase()).toBe("test");
		});

		test("should set tag name to div if none given", () => {
			const el = emel("#test");
			expect(el.firstChild.tagName.toLowerCase()).toBe("div");
		});
	});

	describe("id", () => {
		test("should set id", () => {
			const el = emel("#test");
			expect(el.firstChild.id).toBe("test");
		});
	});

	describe("class", () => {
		test("should set class", () => {
			const el = emel(".test");
			expect(el.firstChild.classList.contains("test")).toBe(true);
		});
	});

	describe("attribute", () => {
		test("should set attribute", () => {
			const el = emel("[test='t']");
			expect(el.firstChild.getAttribute("test")).toBe("t");
		});

		test("should set boolean attribute", () => {
			const el = emel("[test.]");
			expect(el.firstChild.getAttribute("test")).toBe("");
		});
	});

	describe("text", () => {
		test("should set textContent", () => {
			const el = emel("span{test}");
			expect(el.firstChild.textContent).toBe("test");
		});
	});

	describe("children", () => {
		test("should append children", () => {
			const el = emel("div>span*2");
			expect(el.firstChild.childNodes).toHaveLength(2);
		});
	});
});
