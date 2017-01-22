import { Map } from 'immutable';

export type Modifier = {
  id: string,
  statId: string,
  moduleId: number,
  description: string,
  value: number | { statId: string, factor: number, round: 'DOWN' | 'UP' | number }
}

export type Character = {
  stats: Map<string, Map<string, Modifier>>
}

export type CharacterAction =
    | { type: 'SET_STAT_MODIFIER', modifier: Modifier }
    | { type: 'REMOVE_STAT_MODIFIER', statId: string, modifierId: string };


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

export function reduce(state: Character = { stats: Map() }, action : CharacterAction) : Character {
  switch (action.type) {
    case 'SET_STAT_MODIFIER':
      return { ...state, stats: state.stats.setIn([action.modifier.statId, action.modifier.id], action.modifier) };
    case 'REMOVE_STAT_MODIFIER':
      return { ...state, stats: state.stats.deleteIn([action.statId, action.modifierId]) };
    default:
      return state;
  }
}