import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import vitest from "@vitest/eslint-plugin";

import {
  convertToWarnings,
  editlint,
  ruleEntryToWarning,
} from "./dist/index.js";

/** @type {import('eslint').Linter.Config[]} */
export default editlint(
  [
    { files: ["**/*.{js,mjs,cjs,ts"] },
    { ignores: ["dist/", "coverage/"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
    {
      files: ["**/*.js", "**/*.d.ts"],
      ...tseslint.configs.disableTypeChecked,
    },
    convertToWarnings(vitest.configs.recommended),
    vitest.configs.env,
  ],
  {
    condition: /^.*\/?(prefer|no-unused)/,
    mutation: ruleEntryToWarning,
  }
);
