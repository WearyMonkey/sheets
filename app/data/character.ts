import { observable } from 'mobx';
import { Parser, Value } from 'expr-eval';
import { TextState } from './text_state';

export type Tag = {
  id: string
}

export type Description =
    { type: 'IMAGE' | 'TEXT', imageUrl: string | undefined, textState: TextState | undefined }

export type DiceRoll = {
  dice: { id: string, sides: number, dice: number }[],
  bonusStatId: string | undefined
};

export type Action =
    { type: 'ROLL', id: string, diceRoll: DiceRoll, description: Description };

export type ActionType =
    { type: string, displayName: string };

export const actionTypes: ActionType[] = [
  { type: 'ROLL', displayName: 'Dice Roll' }
];

export type Ability = {
  id: string,
  description: Description,
  actions: Action[],
  modifiers: Modifier[],
  tags: Tag[]
};

export type Modifier = {
  id: string,
  statId: string,
  sourceId: string,
  sourceType: 'STAT' | 'MODULE' | 'ABILITY',
  description: Description,
  value: string,
};

export class Character {

  @observable readonly abilities: Ability[];
  @observable readonly modifiers: Modifier[];

  constructor(abilities: Ability[],
              modifiers: Modifier[],) {
    this.abilities = abilities;
    this.modifiers = modifiers;
  }
}

export function getStatValue(character: Character, statId: string): number {
  const modifiers = character.modifiers.filter(m => m.statId == statId);
  return modifiers.reduce((total, modifier) => total + evaluateModifier(character, modifier), 0);
}

const evalFunctions: { [key: string]: Value } = {
  middle(...args: number[]) {
    return args.length != 0
        ? args.sort()[Math.floor(args.length / 2)]
        : 0;
  }
};

export function evaluateModifier(character: Character, modifier: Modifier) {
  try {
    const parser = new Parser();
    const expr = parser.parse(modifier.value);
    const variableValues: { [variable: string]: Value } = { ...evalFunctions };
    expr.variables().forEach(variable => {
      if (!evalFunctions[variable]) {
        variableValues[variable] = getStatValue(character, variable);
      }
    });
    return expr.evaluate(variableValues);
  } catch (e) {
    return 0;
  }
}
