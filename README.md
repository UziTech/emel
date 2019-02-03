[![Build Status](https://travis-ci.com/UziTech/emel.svg?branch=master)](https://travis-ci.com/UziTech/emel)

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
const element = emel(emmetString); // TABLE DOM element
```
