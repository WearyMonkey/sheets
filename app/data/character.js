import { Map } from 'immutable';

export type Modifier = {
  id: string,
  statId: string,
  sourceId: string,
  description: string,
  value: number
}

export type Character = {
  stats: Map<string, Map<string, Modifier>>
}

export type CharacterAction =
    | { type: 'SET_STAT_MODIFIER', modifier: Modifier }
    | { type: 'REMOVE_STAT_MODIFIER', statId: string, modifierId: string }


export function addStatModifier(modifier: Modifier) : CharacterAction {
  return {
    type: 'SET_STAT_MODIFIER',
    modifier
  }
}

export function removeStatModifier(statId: string, modifierId: string) : CharacterAction {
  return {
    type: 'REMOVE_STAT_MODIFIER',
    statId,
    modifierId,
  }
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