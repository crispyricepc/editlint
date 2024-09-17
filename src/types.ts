import { Linter } from "eslint";

export interface RuleEntryWithName<
  Ent extends Linter.RuleEntry = Linter.RuleEntry
> {
  ruleName: string;
  ruleEntry: Ent;
}

export type FnMutation = (
  entry: RuleEntryWithName
) => RuleEntryWithName | Linter.RuleEntry;

export interface RegExMutation {
  condition: RegExp;
  mutation: FnMutation;
}

export type Mutation = RegExMutation | FnMutation;
