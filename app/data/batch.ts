import { Action } from 'components/root';

export type BatchAction = { type: 'BATCH', actions: Array<Action> };

export function batchReducer<S>(reducer : (s: S, a: Action) => S) {
  return function batch(state: S, action: Action) : S {
    switch (action.type) {
      case 'BATCH':
        return action.actions.reduce(batch, state);
      default:
        return reducer(state, action);
    }
  };
}

export function makeBatch(actions: Array<Action>) : BatchAction {
  return { type: 'BATCH', actions };
}