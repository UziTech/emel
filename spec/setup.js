import { JSDOM } from "jsdom";

const jsdom = new JSDOM("<!app-root>", {
	url: "http://localhost/",
});

globalThis.window = jsdom.window;
globalThis.document = jsdom.window.document;
globalThis.Node = jsdom.window.Node;
globalThis.HTMLElement = jsdom.window.HTMLElement;
