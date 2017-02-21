import { State } from '../components/root';
export interface Lens<ParentValue, ChildValue> {
  set(pv: ParentValue, cv: ChildValue): ParentValue;
  get(pv: ParentValue): ChildValue;
}

export interface Store<Value> extends Lens<State, Value> {
  get(state: State) : Value
  set(state: State, value: Value): State
}