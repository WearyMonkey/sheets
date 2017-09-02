import { observable, ObservableMap } from 'mobx';
import { Parser } from 'expr-eval';
import { TextState } from './text_state';

export type Tag = {
  id: string
}

export type Description =
    { type: 'IMAGE' | 'TEXT', imageUrl?: string, textState?: TextState }

export type Bonus =
    { type: 'STAT', description: Description, statId: string }
    | { type: 'VALUE', description: Description, value: number };

export type DiceRoll = {
  dice: { id: string, sides: number, dice: number, bonus?: Bonus }[]
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
  tags: Tag[]
};

export type Modifier = {
  id: string,
  moduleId?: number,
  description: string,
  value: string,
};

export type Stat = {
  id: string,
  modifiers: ObservableMap<Modifier>
}

export class Character {
  constructor(stats: ObservableMap<Stat> = new ObservableMap<Stat>(), abilities: Ability[] = []) {
    this.stats = stats;
    this.abilities = abilities;
  }

  @observable readonly stats: ObservableMap<Stat> = observable.map([]);
  @observable readonly abilities: Ability[] = [];
}

export function getOrCreateStat(character: Character, id: string, defaults: Partial<Stat> = {}): Stat {
  let stat = character.stats.get(id);
  if (!stat) {
    stat = { id, modifiers: observable.map([]), ...defaults };
    character.stats.set(stat.id, stat);
  }
  return stat;
}

export function getStatValue(character: Character, statId: string): number {
  const stat = character.stats.get(statId);
  const modifiers = stat ? stat.modifiers : observable.map<Modifier>();
  return Array.from(modifiers.values()).reduce((total, modifier) => total + evaluateModifier(character, modifier), 0);
}

export function evaluateModifier(character: Character, modifier: Modifier) {
  try {
    const parser = new Parser();
    const expr = parser.parse(modifier.value);
    const variableValues: { [variable: string]: number } = {};
    expr.variables().forEach(variable => {
      const stat = character.stats.get(variable);
      variableValues[ variable ] = stat
          ? getStatValue(character, stat.id)
          : 0;
    });
    return expr.evaluate(variableValues);
  } catch (e) {
    return 0;
  }
}

export function generateStatId(character: Character) {
  const base = 'new_stat_';
  let i = 1;
  while (character.stats.has(base + i)) i += 1;
  return base + i;
}