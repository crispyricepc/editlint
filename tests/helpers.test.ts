import { convertToWarnings } from "../src/helpers.js";

suite("Convert to warnings", () => {
  suite("Number severity", () => {
    test("Converts 2 to 1", () => {
      expect(convertToWarnings({ rules: { "rule-a": 2 } })).toMatchObject({
        rules: { "rule-a": 1 },
      });
    });

    test("Converts 1 to 1", () => {
      expect(convertToWarnings({ rules: { "rule-a": 1 } })).toMatchObject({
        rules: { "rule-a": 1 },
      });
    });

    test("Leaves 0 as-is", () => {
      expect(convertToWarnings({ rules: { "rule-a": 0 } })).toMatchObject({
        rules: { "rule-a": 0 },
      });
    });
  });

  suite("String severity", () => {
    test("Converts 'error' string to 'warn'", () => {
      expect(convertToWarnings({ rules: { "rule-a": "error" } })).toMatchObject(
        {
          rules: { "rule-a": "warn" },
        }
      );
    });

    test("Converts 'warn' string to 'warn'", () => {
      expect(convertToWarnings({ rules: { "rule-a": "warn" } })).toMatchObject({
        rules: { "rule-a": "warn" },
      });
    });

    test("Leaves 'off' as-is", () => {
      expect(convertToWarnings({ rules: { "rule-a": "off" } })).toMatchObject({
        rules: { "rule-a": "off" },
      });
    });
  });

  suite("Multiple rules", () => {
    test("All 'warn'", () => {
      expect(
        convertToWarnings({
          rules: {
            "rule-a": "warn",
            "rule-b": "warn",
            "rule-c": "warn",
          },
        })
      ).toMatchObject({
        rules: {
          "rule-a": "warn",
          "rule-b": "warn",
          "rule-c": "warn",
        },
      });
    });

    test("Some 'error'", () => {
      expect(
        convertToWarnings({
          rules: {
            "rule-a": "error",
            "rule-b": "warn",
            "rule-c": "error",
          },
        })
      ).toMatchObject({
        rules: {
          "rule-a": "warn",
          "rule-b": "warn",
          "rule-c": "warn",
        },
      });
    });

    test("Some 'off', some 'error'", () => {
      expect(
        convertToWarnings({
          rules: {
            "rule-a": "error",
            "rule-b": "warn",
            "rule-c": "off",
          },
        })
      ).toMatchObject({
        rules: {
          "rule-a": "warn",
          "rule-b": "warn",
          "rule-c": "off",
        },
      });
    });
  });

  suite("Array conversion", () => {
    test("Converts empty array to empty array", () => {
      expect(convertToWarnings([])).toHaveLength(0);
    });

    test("Converts array of one ruleset to warnings", () => {
      expect(
        convertToWarnings([
          {
            rules: {
              "rule-a": "error",
              "rule-b": "error",
            },
          },
        ])
      ).toMatchObject([
        {
          rules: {
            "rule-a": "warn",
            "rule-b": "warn",
          },
        },
      ]);
    });

    test("Converts array of multiple rulesets to warnings", () => {
      expect(
        convertToWarnings([
          {
            rules: {
              "rule-a": "error",
              "rule-b": "error",
            },
          },
          {
            rules: {
              "rule-a": "error",
              "rule-b": "off",
            },
          },
        ])
      ).toMatchObject([
        {
          rules: {
            "rule-a": "warn",
            "rule-b": "warn",
          },
        },
        {
          rules: {
            "rule-a": "warn",
            "rule-b": "off",
          },
        },
      ]);
    });
  });

  suite("Rule with options", () => {
    test("Converts from error to warning", () => {
      expect(
        convertToWarnings({
          rules: {
            "rule-a": ["error", { someOption: true }],
          },
        })
      ).toMatchObject({
        rules: {
          "rule-a": ["warn", { someOption: true }],
        },
      });
    });
    test("Converts from warning to warning", () => {
      expect(
        convertToWarnings({
          rules: {
            "rule-a": ["warn", { someOption: true }],
          },
        })
      ).toMatchObject({
        rules: {
          "rule-a": ["warn", { someOption: true }],
        },
      });
    });
    test("Converts from off to off", () => {
      expect(
        convertToWarnings({
          rules: {
            "rule-a": ["off", { someOption: true }],
          },
        })
      ).toMatchObject({
        rules: {
          "rule-a": ["off", { someOption: true }],
        },
      });
    });
  });
});
