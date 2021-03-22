[![Actions Status](https://github.com/UziTech/emel/workflows/CI/badge.svg)](https://github.com/UziTech/emel/actions)
[![Dependency Status](https://david-dm.org/UziTech/emel.svg)](https://david-dm.org/UziTech/emel)

# emel

**em(met) el(ement)**

Create DOM elements with Emmet

## Installation

```sh
npm install emel
```

## Usage

You can use any [emmet abbreviation](https://docs.emmet.io/abbreviations/syntax/).

Options:
- [`returnSingleChild`](#returnsinglechild): `boolean`
- [`multiline`](#multiline): `boolean`
- [`placeholders`](#placeholders): `mixed`

```js
const emel = require("emel");
const emmetString = "table>thead>tr>th{col1}+th{col2}^^tbody>(tr>td[colspan=2]{2 col width})+tr>td.col${1 col width}*2";
const options = {};
const element = emel(emmetString, options);
/**
 * TABLE DOM element:
 * <table>
 *   <thead>
 *     <tr>
 *       <th>col1</th>
 *       <th>col2</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td colspan="2">2 col width</td>
 *     </tr>
 *     <tr>
 *       <td class="col1">1 col width</td>
 *       <td class="col2">1 col width</td>
 *     </tr>
 *   </tbody>
 * </table>
 */
```

### Setting default options

You can set the default options by creating a new instance of emel and pass the default options.


```js
const Emel = require("emel");
const {emel} = new Emel({placeholders: [1, 2]});
const element = emel("div{?}+div{?}");
/**
 * <div>1</div>
 * <div>2</div>
 */
```

### ReturnSingleChild

By default emel will always return the elements as children of a document fragment.
If you set the `returnSingleChild` option to `true` it will only wrap the elements in a document fragment if there are multiple top level elements.

### Multiline

By default space characters are not allowed outside of text nodes.
If you want to write readable strings with multiple lines you can use the `multiline` option to remove newline characters and surrounding spaces.

```js
emel(`
table>
  thead>
    tr>
      th{col1}+
      th{col2}^^
  tbody>
    tr>
      td[colspan=2]{2 col width}^
    tr>
      td.col\${1 col width}*2
`, {
  multiline: true
});
/**
 * <table>
 *   <thead>
 *     <tr>
 *       <th>col1</th>
 *       <th>col2</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td colspan="2">2 col width</td>
 *     </tr>
 *     <tr>
 *       <td class="col1">1 col width</td>
 *       <td class="col2">1 col width</td>
 *     </tr>
 *   </tbody>
 * </table>
 */
```

***Note***: The `multiline` option will remove newline characters and surrounding spaces from text nodes as well (which might not be expected).

```js
emel(`
div{
  line 1
  line 2
}
`, {
  multiline: true
})
// <div>line 1line 2</div>
```

### Placeholders

You can use placeholders to insert dynamic content into any string value.

Replacements can be a string to replace all placeholders with the same value:

```js
emel("?#?.?[?=?]{?}", {
  placeholders: "test"
});
// <test id="test" class="test" test="test">test</test>
```

Or an array to replace each placeholder with different value:

```js
emel("?#?.?[?=?]{?}", {
  placeholders: ["tag", "id", "class", "attrName", "attrValue", "text"]
});
// <tag id="id" class="class" attrname="attrValue">text</tag>
```

***Note***: Placeholders are replaced after parsing so values do not need to be escaped. This comes with a few unintuitive cases.

-   Text placeholders (`{?}`) are replaced after attributes:
    ```js
    // INCORRECT:
    emel("?{?}#?", {
      placeholders: ["tag", "text", "id"]
    });
    // <tag id="text">id</tag>

    // CORRECT:
    emel("?{?}#?", {
      placeholders: ["tag", "id", "text"]
    });
    // <tag id="id">text</tag>
    ```
-   Placeholders on multiplied elements are not copied to every element:
    ```js
    // INCORRECT:
    emel("div{?}*2+span{?}", {
      placeholders: ["div", "span"]
    });
    // <div>div</div><div>span</div><span>?</span>

    // CORRECT:
    emel("div{?}*2+span{?}", {
      placeholders: ["div", "div", "span"]
    });
    // <div>div</div><div>div</div><span>span</span>
    ```

Placeholders can also be an object with keys that refer to any value:

```js
emel("this#is.replaced[with=placeholders]{placeholders}", {
  placeholders: {
    this: "tag",
    is: "id",
    replaced: "class",
    with: "attr",
    placeholders: ["value", "text"],
  }
});
// <tag id="id" class="class" attr="value">text</tag>
```

Placeholder keys must match the entire value to be replaced:

```js
emel("#this.is[not='replaced with placholders']", {
  placeholders: {
    this: "id",
    is: "class",
    replaced: ["attr"],
    with: ["value"],
    placeholders: "text",
  }
});
// <div id="id" class="class" not="replaced with placholders"></div>
```

Text placeholders may also be replaced by a [DOM Node](https://developer.mozilla.org/en-US/docs/Web/API/Node):

```js
const span = emel("span{text}")
emel("div{?}", {
  placeholders: span
});
// <div><span>text</span></div>
```

Attribute name placeholders that equal `false`, `null`, or `undefined` will not be set.

```js
emel("div[attr=val]", {
  placeholders: {
    attr: undefined
  }
});
// <div></div>

emel("div[attr=val]", {
  placeholders: {
    attr: null
  }
});
// <div></div>

emel("div[attr.]", {
  placeholders: {
    attr: false
  }
});
// <div></div>
```

Attribute name placeholders that equal `true` will not be changed.

```js
emel("input[type='checkbox' checked.]", {
  placeholders: {
    checked: false
  }
});
// <input type="checked" />

emel("input[type='checkbox' checked.]", {
  placeholders: {
    checked: true
  }
});
// <input type="checked" checked/>
```
