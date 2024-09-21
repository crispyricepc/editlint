## editlint

editlint lets you edit your eslint rules in bulk

### Requirements

1. `eslint`
1. Using the flat `eslint.config.js` config file instead of `.eslintrc.xx`

### Sample usage

#### Convert rules to warnings

```js
import pluginJs from "@eslint/js";
import { editlint } from "editlint";
// ...

export default [
  // ...
  convertToWarnings(pluginJs.configs.recommended),
  // ...
];
```

#### Convert only rules that start with 'no'

```js
import { ruleEntryToWarning } from "editlint";

export default [
  // ...
  editlint(pluginJs.configs.recommended, {
    condition: /^no/,
    mutation: ruleEntryToWarning,
  }),
];
```
