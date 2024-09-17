import { editlint } from "../src/editlint.js";
import { Mutation } from "../src/types.js";

suite("RegEx Expression Mutations", () => {
  test("Runs mutation on a rule that matches a RegEx", () => {
    expect(
      editlint(
        {
          rules: {
            abc: "warn",
          },
        },
        {
          condition: /^abc$/,
          mutation: () => "off",
        }
      )
    ).toMatchObject({ rules: { abc: "off" } });
  });

  test("Doesn't run a mutation if the RegEx doesn't match", () => {
    expect(
      editlint(
        {
          rules: {
            abcd: "warn",
          },
        },
        {
          condition: /^abc$/,
          mutation: () => "off",
        }
      )
    ).toMatchObject({ rules: { abcd: "warn" } });
  });
});

suite("Function Mutations", () => {
  test("Calls the mutation function with the correct parameters", () => {
    const mutationFn = vi.fn();

    editlint({ rules: { "rule-1": "warn" } }, mutationFn);

    expect(mutationFn).toHaveBeenCalledWith({
      ruleName: "rule-1",
      ruleEntry: "warn",
    });
  });

  test("Doesn't run the mutation function if there are no rules", () => {
    const mutationFn = vi.fn();

    editlint({}, mutationFn);

    expect(mutationFn).not.toHaveBeenCalled();
  });

  test("Runs a mutation function twice with 2 rules", () => {
    const mutationFn = vi.fn();

    editlint(
      {
        rules: {
          "rule-1": "off",
          "rule-2": "off",
        },
      },
      mutationFn
    );

    expect(mutationFn).toHaveBeenCalledTimes(2);
  });

  test("Applies a mutation to a rule", () => {
    expect(
      editlint({ rules: { "rule-a": "off" } }, () => ({
        ruleName: "rule-b",
        ruleEntry: "warn",
      }))
    ).toMatchObject({ rules: { "rule-b": "warn" } });
  });
});

suite("Multiple mutations", () => {
  test("One RegEx one Function", () => {
    const mutationFn = vi.fn();
    const regexFn = vi.fn();
    editlint({ rules: { "rule-a": "off", "rule-b": "error" } }, mutationFn, {
      condition: /^rule-a$/,
      mutation: regexFn,
    });

    expect(mutationFn).toHaveBeenCalled();
    expect(regexFn).toHaveBeenCalled();
  });

  test("Call mutations in order", () => {
    let lastCalled = null;
    const mutationA: Mutation = () => {
      lastCalled = "A";
      return { ruleName: "test", ruleEntry: "off" };
    };
    const mutationB: Mutation = () => {
      lastCalled = "B";
      return { ruleName: "test", ruleEntry: "off" };
    };

    editlint({ rules: { "rule-1": "off" } }, mutationA, mutationB);

    expect(lastCalled).toStrictEqual("B");
  });
});

suite("Multiple configs", () => {
  test("Runs on multiple config blocks", () => {
    const fnMutation = vi.fn();
    editlint(
      [{ rules: { "rule-a": "error" } }, { rules: { "rule-b": "error" } }],
      fnMutation
    );

    expect(fnMutation).toHaveBeenCalledTimes(2);
  });
});

suite("Edge cases", () => {
  test("Doesn't mutate undefined rule entries", () => {
    expect(
      editlint({
        rules: {
          abc: undefined,
        },
      })
    ).toMatchObject({ rules: { abc: undefined } });
  });
});
