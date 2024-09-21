import { Linter } from "eslint";
import { Mutation } from "./types.js";

export function editlint<T extends Linter.Config | Linter.Config[]>(
  config: T,
  ...mutations: Mutation[]
): T;
export function editlint(
  config: Linter.Config | Linter.Config[],
  ...mutations: Mutation[]
) {
  const configArray = Array.isArray(config) ? config : [config];

  const mutationFns = mutations.map((mutation) => {
    if (typeof mutation === "function") return mutation;

    return (({ ruleName, ruleEntry }) => {
      if (!ruleName.match(mutation.condition)) {
        return { ruleName, ruleEntry };
      }

      return mutation.mutation({ ruleName, ruleEntry });
    }) satisfies Mutation;
  });

  const mappedConfig = configArray.map((record) => ({
    ...record,
    rules:
      record.rules &&
      Object.fromEntries(
        Object.entries(record.rules).map(([ruleName, ruleEntry]) => {
          if (ruleEntry === undefined) return [ruleName, ruleEntry];

          let rule = { ruleName, ruleEntry };
          for (const mutation of mutationFns) {
            const newRuleEnt = mutation(rule);
            if (typeof newRuleEnt === "object" && "ruleName" in newRuleEnt) {
              // Is RuleEntryWithName
              rule = newRuleEnt;
            } else {
              // Is Linter.RuleEntry
              rule = { ruleName, ruleEntry: newRuleEnt };
            }
          }

          return [rule.ruleName, rule.ruleEntry];
        })
      ),
  }));

  if (Array.isArray(config)) return mappedConfig;

  return mappedConfig[0];
}
