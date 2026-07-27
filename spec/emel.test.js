import { describe, test } from "node:test";
import assert from "node:assert/strict";
import emel from "../src/emel.js";

describe("emel", () => {
	test("should return a document fagment", () => {
		assert.equal(emel().nodeType, Node.DOCUMENT_FRAGMENT_NODE);
		assert.equal(emel("span").childNodes[0].nodeType, Node.ELEMENT_NODE);
		assert.equal(emel("div{test}").childNodes[0].nodeType, Node.ELEMENT_NODE);
	});

	test("should return an element with 2 children", () => {
		const el = emel("div*2");
		assert.equal(el.childNodes[0].nodeType, Node.ELEMENT_NODE);
		assert.equal(el.childNodes.length, 2);
	});

	test("should create a plain text node", () => {
		const el = emel("{test}");
		assert.equal(el.childNodes[0].nodeType, Node.TEXT_NODE);
		assert.equal(el.childNodes[0].textContent, "test");
	});

	describe("tag", () => {
		test("should set tag name", () => {
			const el = emel("test");
			assert.equal(el.childNodes[0].tagName.toLowerCase(), "test");
		});

		test("should set tag name to div if none given", () => {
			const el = emel("#test");
			assert.equal(el.childNodes[0].tagName.toLowerCase(), "div");
		});
	});

	describe("id", () => {
		test("should set id", () => {
			const el = emel("#test");
			assert.equal(el.childNodes[0].id, "test");
		});
	});

	describe("class", () => {
		test("should set class", () => {
			const el = emel(".test");
			assert.equal(el.childNodes[0].classList.contains("test"), true);
		});

		test("should set multiple classes", () => {
			const classes = ["test-1", "test-2"];

			const el = emel(classes.map((c) => `.${c}`).join(""));

			/** @type {HTMLElement} */
			const firstChild = el.childNodes[0];

			classes.forEach((cl) => {
				assert.equal(firstChild.classList.contains(cl), true);
			});
		});
	});

	describe("attribute", () => {
		test("should set attribute", () => {
			const el = emel("[test='t']");
			assert.equal(el.childNodes[0].getAttribute("test"), "t");
		});

		test("should set attribute with undefined as boolean", () => {
			const el = emel("[test]");
			assert.equal(el.childNodes[0].getAttribute("test"), "");
		});

		test("should set boolean attribute", () => {
			const el = emel("[test.]");
			assert.equal(el.childNodes[0].getAttribute("test"), "");
		});
	});

	describe("text", () => {
		test("should set textContent", () => {
			const el = emel("span{test}");
			assert.equal(el.childNodes[0].textContent, "test");
		});
	});

	describe("children", () => {
		test("should append children", () => {
			const el = emel("div>span*2");
			assert.equal(el.childNodes[0].childNodes.length, 2);
		});
	});

	describe("placeholders", () => {
		describe("node", () => {
			test("should replace placeholder with HTMLElement", () => {
				const span = document.createElement("span");
				const el = emel("div{?}", { placeholders: span });
				assert.equal(el.childNodes[0].childNodes.length, 1);
				assert.equal(
					el.childNodes[0].childNodes[0].tagName.toLowerCase(),
					"span",
				);
			});

			test("should replace placeholder with HTMLElement in array", () => {
				const span = document.createElement("span");
				const el = emel("div{?}", { placeholders: [span] });
				assert.equal(el.childNodes[0].childNodes.length, 1);
				assert.equal(
					el.childNodes[0].childNodes[0].tagName.toLowerCase(),
					"span",
				);
			});

			test("should use placeholder instead of creating new element", () => {
				const span = document.createElement("span");
				span.customProperty = true;
				const el = emel("?#id.class[attr=value]{text}", { placeholders: span });
				assert.equal(el.childNodes.length, 1);
				assert.equal(el.childNodes[0].tagName.toLowerCase(), "span");
				assert.equal(el.childNodes[0].id, "id");
				assert.equal(el.childNodes[0].className, "class");
				assert.equal(el.childNodes[0].getAttribute("attr"), "value");
				assert.equal(el.childNodes[0].textContent, "text");
				assert.equal(el.childNodes[0].customProperty, true);
				assert.equal(el.childNodes[0], span);
			});

			test("should allow placeholder siblings", () => {
				const span1 = document.createElement("span");
				const span2 = document.createElement("span");
				const el = emel("?+?", { placeholders: [span1, span2] });
				assert.equal(el.childNodes.length, 2);
				assert.equal(el.childNodes[0], span1);
				assert.equal(el.childNodes[1], span2);
			});

			test("should allow placeholder children", () => {
				const span1 = document.createElement("span");
				const span2 = document.createElement("span");
				const el = emel("?>?", { placeholders: [span1, span2] });
				assert.equal(el.childNodes.length, 1);
				assert.equal(el.childNodes[0], span1);
				assert.equal(el.childNodes[0].childNodes.length, 1);
				assert.equal(el.childNodes[0].childNodes[0], span2);
			});
		});

		describe("array", () => {
			test("should replace placeholder in textNode", () => {
				const el = emel("{?}", { placeholders: ["test"] });
				assert.equal(el.childNodes[0].nodeType, Node.TEXT_NODE);
				assert.equal(el.childNodes[0].textContent, "test");
			});

			test("should replace placeholder in element text", () => {
				const el = emel("div{?}", { placeholders: ["test"] });
				assert.equal(el.childNodes[0].textContent, "test");
			});

			test("should set tag name", () => {
				const el = emel("?", { placeholders: ["test"] });
				assert.equal(el.childNodes[0].tagName.toLowerCase(), "test");
			});

			test("should replace placeholder in attribute", () => {
				const el = emel("[test='?']", { placeholders: ["t"] });
				assert.equal(el.childNodes[0].getAttribute("test"), "t");
			});

			test("should replace placeholder in attribute name", () => {
				const el = emel("[?=?]", { placeholders: ["test", "t"] });
				assert.equal(el.childNodes[0].getAttribute("test"), "t");
			});

			test("should not replace after all values used", () => {
				const el = emel("[?=?]", { placeholders: ["test"] });
				assert.equal(el.childNodes[0].getAttribute("test"), "?");
			});

			test("should replace placeholder in id", () => {
				const el = emel("#?", { placeholders: ["test"] });
				assert.equal(el.childNodes[0].id, "test");
			});

			test("should replace placeholder in class", () => {
				const el = emel(".?", { placeholders: ["test"] });
				assert.equal(el.childNodes[0].classList.contains("test"), true);
			});

			test("should replace placeholder in id", () => {
				const el = emel("#?", { placeholders: ["test"] });
				assert.equal(el.childNodes[0].id, "test");
			});

			test("should replace placeholder in multiplied elements", () => {
				const el = emel("div>span{?}*2", { placeholders: ["test1", "test2"] });
				assert.equal(el.childNodes[0].childNodes.length, 2);
				assert.equal(el.childNodes[0].childNodes[0].textContent, "test1");
				assert.equal(el.childNodes[0].childNodes[1].textContent, "test2");
			});

			test("should replace placeholder in children first", () => {
				const el = emel("div>span>span{?}*2^span{?}", {
					placeholders: ["test1", "test2", "test3"],
				});
				assert.equal(el.childNodes[0].childNodes.length, 2);
				assert.equal(el.childNodes[0].childNodes[0].childNodes.length, 2);
				assert.equal(
					el.childNodes[0].childNodes[0].childNodes[0].textContent,
					"test1",
				);
				assert.equal(
					el.childNodes[0].childNodes[0].childNodes[1].textContent,
					"test2",
				);
				assert.equal(el.childNodes[0].childNodes[1].textContent, "test3");
			});

			test("should replace text placeholder after attributes", () => {
				const el = emel("?{?}#?.?[?='?']", {
					placeholders: [
						"tag",
						"id",
						"class",
						"attrName",
						"attr Value",
						"text",
					],
				});
				assert.equal(el.childNodes[0].tagName.toLowerCase(), "tag");
				assert.equal(el.childNodes[0].id, "id");
				assert.equal(el.childNodes[0].classList.contains("class"), true);
				assert.equal(el.childNodes[0].getAttribute("attrName"), "attr Value");
				assert.equal(el.childNodes[0].textContent, "text");
			});
		});

		describe("string", () => {
			test("should replace all placeholders", () => {
				const el = emel("?{?}#?.?[?=?]", {
					placeholders: "test",
				});
				assert.equal(el.childNodes[0].tagName.toLowerCase(), "test");
				assert.equal(el.childNodes[0].id, "test");
				assert.equal(el.childNodes[0].classList.contains("test"), true);
				assert.equal(el.childNodes[0].getAttribute("test"), "test");
				assert.equal(el.childNodes[0].textContent, "test");
			});

			test("should replace with empty string", () => {
				const el = emel("div{?}", {
					placeholders: "",
				});
				assert.equal(el.childNodes[0].textContent, "");
			});
		});

		describe("number", () => {
			test("should replace with a number", () => {
				const el = emel("div{?}", {
					placeholders: 1,
				});
				assert.equal(el.childNodes[0].textContent, "1");
			});

			test("should replace with a zero", () => {
				const el = emel("div{?}", {
					placeholders: 0,
				});
				assert.equal(el.childNodes[0].textContent, "0");
			});
		});

		describe("boolean", () => {
			test("should replace with 'true'", () => {
				const el = emel("div{?}", {
					placeholders: true,
				});
				assert.equal(el.childNodes[0].textContent, "true");
			});

			test("should replace with 'false'", () => {
				const el = emel("div{?}", {
					placeholders: false,
				});
				assert.equal(el.childNodes[0].textContent, "false");
			});

			test("should replace attribute with 'false'", () => {
				const el = emel("div[attr=val]", {
					placeholders: { val: false },
				});
				assert.equal(el.childNodes[0].getAttribute("attr"), "false");
			});

			test("should remove attribute on false name", () => {
				const el = emel("div[attr=val]", {
					placeholders: { attr: false },
				});
				assert.equal(el.childNodes[0].getAttribute("false"), null);
				assert.equal(el.childNodes[0].getAttribute("attr"), null);
			});

			test("should remove boolean attribute on false", () => {
				const el = emel("div[attr.]", {
					placeholders: { attr: false },
				});
				assert.equal(el.childNodes[0].getAttribute("false"), null);
				assert.equal(el.childNodes[0].getAttribute("attr"), null);
			});

			test("should remove attribute on null", () => {
				const el = emel("div[attr.]", {
					placeholders: { attr: null },
				});
				assert.equal(el.childNodes[0].getAttribute("attr"), null);
			});

			test("should remove attribute on undefined", () => {
				const el = emel("div[attr.]", {
					placeholders: { attr: undefined },
				});
				assert.equal(el.childNodes[0].getAttribute("attr"), null);
			});

			test("should retain boolean attribute on true value", () => {
				const el = emel("div[attr.]", {
					placeholders: { attr: true },
				});
				assert.equal(el.childNodes[0].getAttribute("attr"), "");
			});

			test("should retain attribute on true value", () => {
				const el = emel("div[attr=val]", {
					placeholders: { attr: true },
				});
				assert.equal(el.childNodes[0].getAttribute("attr"), "val");
			});
		});

		describe("object", () => {
			test("should replace labeled placeholders", () => {
				const el = emel("tag{text}#id.class[attr=value]", {
					placeholders: {
						tag: "tag1",
						text: "text1",
						id: "id1",
						class: "class1",
						attr: "attr1",
						value: "value1",
					},
				});
				assert.equal(el.childNodes[0].tagName.toLowerCase(), "tag1");
				assert.equal(el.childNodes[0].id, "id1");
				assert.equal(el.childNodes[0].classList.contains("class1"), true);
				assert.equal(el.childNodes[0].getAttribute("attr1"), "value1");
				assert.equal(el.childNodes[0].textContent, "text1");
			});

			test("should replace labeled placeholders in array", () => {
				const el = emel("tag{text}#id.class[attr=value]*2", {
					placeholders: {
						tag: ["tag1", "tag2"],
						text: ["text1", "text2"],
						id: ["id1", "id2"],
						class: ["class1", "class2"],
						attr: ["attr1", "attr2"],
						value: ["value1", "value2"],
					},
				});
				assert.equal(el.childNodes[0].tagName.toLowerCase(), "tag1");
				assert.equal(el.childNodes[0].id, "id1");
				assert.equal(el.childNodes[0].classList.contains("class1"), true);
				assert.equal(el.childNodes[0].getAttribute("attr1"), "value1");
				assert.equal(el.childNodes[0].textContent, "text1");
				assert.equal(el.childNodes[1].tagName.toLowerCase(), "tag2");
				assert.equal(el.childNodes[1].id, "id2");
				assert.equal(el.childNodes[1].classList.contains("class2"), true);
				assert.equal(el.childNodes[1].getAttribute("attr2"), "value2");
				assert.equal(el.childNodes[1].textContent, "text2");
			});
		});

		describe("options is placeholder", () => {
			describe("node", () => {
				test("should replace placeholder with HTMLElement", () => {
					const span = document.createElement("span");
					const el = emel("div{?}", span);
					assert.equal(el.childNodes[0].childNodes.length, 1);
					assert.equal(
						el.childNodes[0].childNodes[0].tagName.toLowerCase(),
						"span",
					);
				});
			});

			describe("array", () => {
				test("should replace placeholder in textNode", () => {
					const el = emel("{?}", ["test"]);
					assert.equal(el.childNodes[0].nodeType, Node.TEXT_NODE);
					assert.equal(el.childNodes[0].textContent, "test");
				});
			});

			describe("string", () => {
				test("should replace all placeholders", () => {
					const el = emel("?{?}#?.?[?=?]", "test");
					assert.equal(el.childNodes[0].tagName.toLowerCase(), "test");
					assert.equal(el.childNodes[0].id, "test");
					assert.equal(el.childNodes[0].classList.contains("test"), true);
					assert.equal(el.childNodes[0].getAttribute("test"), "test");
					assert.equal(el.childNodes[0].textContent, "test");
				});
			});

			describe("number", () => {
				test("should replace with a number", () => {
					const el = emel("div{?}", 0);
					assert.equal(el.childNodes[0].textContent, "0");
				});
			});

			describe("boolean", () => {
				test("should replace with 'false'", () => {
					const el = emel("div{?}", false);
					assert.equal(el.childNodes[0].textContent, "false");
				});
			});
		});
	});

	describe("multiline", () => {
		test("error by default", () => {
			assert.throws(() => {
				emel(`
					div{div1}+
					div{div2}
				`);
			});
		});

		test("allow multiline in text", () => {
			const el = emel("div{line 1\nline 2}");
			assert.equal(el.childNodes[0].textContent.trim(), "line 1\nline 2");
		});

		test("remove multiline in text", () => {
			const el = emel("div{line 1\nline 2}", { multiline: true });
			assert.equal(el.childNodes[0].textContent.trim(), "line 1line 2");
		});

		test("remove all newlines", () => {
			const el = emel(
				`
				div{
					div1
				}+
				div{
					div2
				}
			`,
				{ multiline: true },
			);
			assert.equal(el.childNodes[0].textContent, "div1");
			assert.equal(el.childNodes[1].textContent, "div2");
		});

		test("keep space in text", () => {
			const el = emel(
				`
				div{div 1}+
				div{div 2}
			`,
				{ multiline: true },
			);
			assert.equal(el.childNodes[0].textContent, "div 1");
			assert.equal(el.childNodes[1].textContent, "div 2");
		});
	});

	describe("returnSingleChild", () => {
		test("should return single child", () => {
			const el = emel("div", { returnSingleChild: true });
			assert.equal(el.nodeType, Node.ELEMENT_NODE);
			assert.equal(el.tagName.toLowerCase(), "div");
			assert.equal(el.childNodes.length, 0);
		});

		test("should return a docment fragment", () => {
			const el = emel("div*2", { returnSingleChild: true });
			assert.equal(el.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
			assert.equal(el.childNodes.length, 2);
		});

		test("should return a text fragment", () => {
			const el = emel("{test}", { returnSingleChild: true });
			assert.equal(el.nodeType, Node.TEXT_NODE);
			assert.equal(el.textContent, "test");
		});
	});

	describe("emel class", () => {
		test("should set emel prop", () => {
			const e = new emel();
			assert.equal(e.emel().nodeType, Node.DOCUMENT_FRAGMENT_NODE);
			assert.equal(e.emel("div").childNodes[0].nodeType, Node.ELEMENT_NODE);
		});

		test("should set options", () => {
			const e = new emel({ returnSingleChild: true });
			const el = e.emel("div{test}");
			assert.equal(el.nodeType, Node.ELEMENT_NODE);
			assert.equal(el.textContent, "test");
		});

		test("should reset options", () => {
			const e1 = new emel({ returnSingleChild: true });
			const e2 = new emel();
			assert.equal(e1.emel("div").nodeType, Node.ELEMENT_NODE);
			assert.equal(e2.emel("div").nodeType, Node.DOCUMENT_FRAGMENT_NODE);
		});
	});
});
