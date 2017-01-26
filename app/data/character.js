// @flow
import { Map, List } from 'immutable';

export type Description =
    | { type: 'IMAGE', url: string }
    | { type: 'TEXT',  value: string };

export type Bonus =
    | { type: 'STAT', description: Description, statId: string  }
    | { type: 'VALUE', description: Description, value: number };

export type DiceRoll = {
  dice: List<{ sides: number, dice: number, bonus: Bonus }>
};

export type Action =
    | { type: 'ROLL', diceRoll: DiceRoll, description: Description };

export type Ability = {
  id: string,
  description: Description,
  actions: List<Action>
};

export type Modifier = {
  id: string,
  statId: string,
  moduleId: number,
  description: string,
  value: number | { statId: string, factor: number, round: 'DOWN' | 'UP' | number }
};

export type Character = {
  stats: Map<string, Map<string, Modifier>>,
  abilities: List<Ability>
};

export type CharacterAction =
    | { type: 'SET_STAT_MODIFIER', modifier: Modifier }
    | { type: 'REMOVE_STAT_MODIFIER', statId: string, modifierId: string }
    | { type: 'REMOVE_ABILITY', abilityId: string }
    | { type: 'ADD_ABILITY', ability: Ability }


export function getStatValue(character: Character, statId: string) : number {
  const modifiers = character.stats.get(statId) || Map();
  return modifiers.reduce((total, modifier) => {
    let value = modifier.value;
    if (typeof value == 'number') {
      return total + value;
    } else {
      return total + round(getStatValue(character, value.statId) * value.factor, value.round);
    }
  }, 0);
}

export function getModifier(character: Character, statId: string, id: string) : ?Modifier {
  return character.stats.getIn([statId, id]);
}

function round(value: number, round: 'DOWN' | 'UP' | number) : number {
  if (typeof round === 'string') {
      const softRound = Math.round(value);
      if (Math.abs(softRound - value) < 0.0005) {
        return softRound;
      } else if (round == 'DOWN') {
        return Math.floor(value);
      } else {
        return Math.ceil(value);
      }
  } else {
    return Number(value.toFixed(value));
  }
}

export function setStatModifier(modifier: Modifier) : CharacterAction {
  return { type: 'SET_STAT_MODIFIER', modifier }
}

export function removeStatModifier(statId: string, modifierId: string) : CharacterAction {
  return { type: 'REMOVE_STAT_MODIFIER', statId, modifierId }
}

export function reduce(character: Character = { stats: Map(), abilities: List() }, action : CharacterAction) : Character {
  switch (action.type) {
    case 'REMOVE_ABILITY':
      const id = action.abilityId;
      return { ...character, abilities: character.abilities.filter(a => a.id != id) };
    case 'ADD_ABILITY':
      return { ...character, abilities: character.abilities.push(action.ability) };
    case 'SET_STAT_MODIFIER':
      return { ...character, stats: character.stats.setIn([action.modifier.statId, action.modifier.id], action.modifier) };
    case 'REMOVE_STAT_MODIFIER':
      let stats = character.stats;
      let stat = stats.get(action.statId);
      if (stat) {
        stat = stat.delete(action.modifierId);
      }
      if (stat && stat.size == 0) {
        stats = stats.delete(action.statId);
      }
      return { ...character, stats };
    default:
      return character;
  }
}