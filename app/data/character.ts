import { observable, ObservableMap } from 'mobx';
import { Parser } from 'expr-eval';
import { TextState } from './text_state';

type JSON = any;

export type Description =
    { type: 'IMAGE' | 'TEXT', imageUrl?: string|null, textState?: TextState|null }

function descriptionToJson(desc: Description): JSON {
  return { 'type': desc.type, 'imageUrl': desc.imageUrl, 'textState': desc.textState && TextState.toJson(desc.textState) };
}

function descriptionFromJson(json: JSON): Description {
  return { type: json['type'], imageUrl: json['imageUrl'], textState: TextState.fromJson(json['textState']) };
}

export type Bonus =
    { type: 'STAT', description: Description, statId: string  }
    | { type: 'VALUE', description: Description, value: number };

function bonusToJson(bonus: Bonus): any {
  const obj : any = { 'type': bonus.type, 'description': descriptionToJson(bonus.description) };
  if (bonus.type == 'STAT') obj['statId'] = bonus.statId;
  if (bonus.type == 'VALUE') obj['value'] = bonus.value;
  return obj;
}

function bonusFromJson(json: JSON): Bonus {
  switch (json['type']) {
    case 'VALUE': return { type: 'VALUE', description: descriptionFromJson(json.description), value: json['value'] };
    case 'STAT': return { type: 'STAT', description: descriptionFromJson(json.description), statId: json['statId'] };
    default: throw new Error(`Unknown bonus type ${json['type']}`);
  }
}

export type DiceRoll = {
  dice: { id: string, sides: number, dice: number, bonus?: Bonus|null }[]
};

function diceRollToJson(diceRoll: DiceRoll): JSON {
  return { 'dice': diceRoll.dice.map(die => ( 
    { 'id': die.id, 'side': die.sides, 'dice': die.dice, 'bonus': die.bonus && bonusFromJson(die.bonus) }
  ))};
}

function diceRollFromJson(json: JSON): DiceRoll {
  return { dice: json.dice.map((jsonDie : JSON) => (
      { id: jsonDie['id'], side: jsonDie['sides'], dice: jsonDie['dice'], bonus: jsonDie['bonus'] && bonusToJson(jsonDie['bonus']) }
  ))};
}

export type Action =
    { type: 'ROLL', id: string, diceRoll: DiceRoll, description: Description };

function actionToJson(action: Action): JSON {
  const obj : JSON = { 'type': action.type, 'id': action.id, 'description': descriptionToJson(action.description) };
  if (action.type == 'ROLL') obj['diceRoll'] = diceRollToJson(action.diceRoll);
  return obj;
}

function actionFromJson(json: JSON): Action {
  switch (json['type']) {
    case 'ROLL': return { type: 'ROLL', id: json['id'], description: descriptionFromJson(json['description']), diceRoll: diceRollFromJson(json['diceRoll']) };
    default: throw new Error(`Unknown action type ${json['type']}`);
  }
}

export type ActionType =
    { type: string, displayName: string };

export const actionTypes : ActionType[] = [
  { type: 'ROLL', displayName: 'Dice Roll' }
];

export type Ability = {
  id: string,
  description: Description,
  actions: Action[]
};

function abilityToJson(ability: Ability): JSON {
  return { 'id': ability.id, 'description': descriptionToJson(ability.description), 'actions': ability.actions.map(action => actionToJson(action)) };
}

function abilityFromJson(json: JSON): Ability {
  return { id: json['id'], description: descriptionFromJson(json['description']), actions: json['actions'].map((action: JSON) => actionFromJson(action)) };
}

export type Modifier = {
  id: string,
  moduleId: number,
  description: string,
  value: string,
};

function modifierToJson(modifier: Modifier): JSON {
  return { 'id': modifier.id, 'moduleId': modifier.moduleId, 'description': modifier.description, 'value': modifier.value };
}

function modifierFromJson(json: JSON): Modifier {
  return { id: json['id'], moduleId: json['moduleId'], description: json['description'], value: json['value'] };
}

export type Stat = {
  id: string,
  modifiers: ObservableMap<Modifier>
}

function mapToJson<V>(map: ObservableMap<V>, valueToJson: (v: V) => JSON): [string, JSON][] {
  return Array.from(map.entries()).map(([k, v]) => {
    const record: [string, JSON] = [k, valueToJson(v)];
    return record;
  });
}

function mapFromJson<V>(records: [string, JSON][], valueFromJson: (json: JSON) => V): ObservableMap<V> {
  const map: [string, V][] = records.map(([k, j]) => {
    const entry: [string, V] = [k, valueFromJson(j)];
    return entry;
  });
  return observable.map<V>(map);
}

function statToJson(stat: Stat): JSON {
  return { 'id': stat.id, 'modifiers': mapToJson(stat.modifiers, modifierToJson) };
}

function statFromJson(json: JSON): Stat {
  return { id: json['id'], modifiers: mapFromJson(json['modifiers'], modifierFromJson) };
}

export class Character {
  constructor(stats: ObservableMap<Stat> = new ObservableMap<Stat>(), abilities: Ability[] = []) {
    this.stats = stats;
    this.abilities = abilities;
  }

  @observable readonly stats: ObservableMap<Stat> = observable.map([]);
  @observable readonly abilities: Ability[] = [];
}

export function characterToJson(character: Character): JSON {
  return { 'stats': mapToJson(character.stats, statToJson), 'abilities': character.abilities.map(abilityToJson) };
}

export function characterFromJson(json: JSON): Character {
  return new Character(mapFromJson(json['stats'], statFromJson), json['abilities'].map(abilityFromJson));
}

export function getOrCreateStat(character: Character, id: string, defaults: Partial<Stat> = {}) : Stat {
  let stat = character.stats.get(id);
  if (!stat) {
    stat = { id, modifiers: observable.map([]), ...defaults};
    character.stats.set(stat.id, stat);
  }
  return stat;
}

export function getStatValue(character: Character, statId: string) : number {
  const stat = character.stats.get(statId);
  const modifiers = stat ? stat.modifiers : observable.map<Modifier>();
  return Array.from(modifiers.values()).reduce((total, modifier) => total + evaluateModifier(character, modifier), 0);
}

function evaluateModifier(character: Character, modifier: Modifier) {
  const parser = new Parser();
  const expr = parser.parse(modifier.value);
  const variableValues : { [variable: string]: number } = {};
  expr.variables().forEach(variable => {
    const stat = character.stats.get(variable);
    variableValues[variable] = stat ? getStatValue(character, stat.id) : 0;
  });
  return expr.evaluate(variableValues);
}

export function generateStatId(character: Character) {
  const base = 'new_stat_';
  let i = 1;
  while (character.stats.has(base + i)) i += 1;
  return base + i;
}