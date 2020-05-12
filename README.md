[![Actions Status](https://github.com/UziTech/emel/workflows/CI/badge.svg)](https://github.com/UziTech/emel/actions)
[![Dependency Status](https://david-dm.org/UziTech/emel.svg)](https://david-dm.org/UziTech/emel)

# emel

Create DOM elements with Emmet

## Installation

```sh
npm install emel
```

## Usage

You can use any [emmet abbreviation](https://docs.emmet.io/abbreviations/syntax/).

```js
const emel = require("emel");
const emmetString = "table>thead>tr>th{col1}+th{col2}^^tbody>(tr>td[colspan=2]{2 col width})+tr>td.col${1 col width}*2";
const element = emel(emmetString);
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
