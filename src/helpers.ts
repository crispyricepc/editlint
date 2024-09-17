import { Linter } from "eslint";
import { editlint } from "./editlint.js";
import { RuleEntryWithName } from "./types.js";

export function ruleEntryToWarning<
  Ent extends Linter.RuleEntry = Linter.RuleEntry
>(entry: RuleEntryWithName<Ent>): Ent;
export function ruleEntryToWarning({
  ruleName,
  ruleEntry,
}: RuleEntryWithName): Linter.RuleEntry {
  if (ruleEntry === 0 || ruleEntry === "off") {
    // Ignore if the rule is off
    return ruleEntry;
  }

  if (typeof ruleEntry === "number") {
    // Number severity, see Linter.Severity
    return 1;
  }

  if (typeof ruleEntry === "string") {
    // String severity, see Linter.StringSeverity
    return "warn";
  }

  // default: Severity with options
  const newRuleEntry = ruleEntry[0];
  return [
    ruleEntryToWarning({
      ruleName,
      ruleEntry: newRuleEntry,
    }),
    ruleEntry[1],
  ];
}

export function convertToWarnings<T extends Linter.Config | Linter.Config[]>(
  config: T
): T;
export function convertToWarnings(config: Linter.Config | Linter.Config[]) {
  return editlint(config, ruleEntryToWarning);
}
