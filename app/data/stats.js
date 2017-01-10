// @flow

import { Map } from 'immutable';

export type Modifier = {
  id: string,
  statId: string,
  sourceId: string,
  description: string,
  value: number
}

export const SET_STAT_MODIFIER = 'SET_STAT_MODIFIER';
export function addStatModifier(modifier: Modifier) {
  return {
    type: SET_STAT_MODIFIER,
    modifier
  }
}

export const REMOVE_STAT_MODIFIER = 'REMOVE_STAT_MODIFIER';
export function removeStatModifier(modifierId: string) {
  return {
    type: REMOVE_STAT_MODIFIER,
    modifierId
  }
}

export function reduce(state: Map<string, Map<string, Modifier>> = Map(), action) : Map<string, Map<string, Modifier>> {
  switch (action.type) {
    case SET_STAT_MODIFIER:
      return state.setIn([action.modifier.statId, action.modifier.id], action.modifier);
    case REMOVE_STAT_MODIFIER:
      return state.deleteIn([action.modifier.statId, action.modifier.id]);
    default:
      return state;
  }
}