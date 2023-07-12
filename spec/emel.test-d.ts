import emel from "../src/emel.js";
import {expectError, expectType} from 'tsd';

expectType<DocumentFragment>(emel());

// placeholders
const span = document.createElement("span");
emel("", span);
emel("", "test");
emel("", 1);
emel("", true);
emel("", [span, "test", 1, true, null, undefined]);
emel("", { placeholders: span });
emel("", { placeholders: "test" });
emel("", { placeholders: 1 });
emel("", { placeholders: true });
emel("", { placeholders: null });
emel("", { placeholders: undefined });
emel("", { placeholders: [span, "test", 1, true, null, undefined] });
emel("", {
  placeholders: {
    span: span,
    string: "test",
    number: 1,
    bool: true,
    null: null,
    undefined: undefined,
    array: [span, "test", 1, true, null, undefined]
  }
});

// multiline
emel("", { multiline: true });
emel("", { multiline: false });

// returnSingleChild
expectType<Node>(emel("", { returnSingleChild: true }));
expectType<DocumentFragment>(emel("", { returnSingleChild: false }));

// doc
emel("", { doc: document });

// Emel class

const e = new emel();
e.emel().nodeType;
e.emel("", {
  doc: document,
  returnSingleChild: true,
  multiline: false,
  placeholders: {},
});
