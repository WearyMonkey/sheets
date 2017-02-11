import { Action } from 'components/root';
import { Store as SourceStore, createStore } from 'redux';

export interface Lens<ParentValue, ChildValue> {
  set(pv: ParentValue, cv: ChildValue): ParentValue;
  get(pv: ParentValue): ChildValue;
}

export interface Store<Value> {
  get(): Value;
  dispatch(a: Action): void;
  update(updater: (v: Value) => Value): void;
  lens<ChildValue>(lens: Lens<Value, ChildValue>): Store<ChildValue>
}

export class ReduxStore<RootValue, Value> implements Store<Value> {

  static createRoot<State>(reducer: (s: State, a: Action) => State, initialState?: State) {
    const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

    const store = createStore((state: State, action: any) => {
      if (action.type == 'UPDATE') {
        return action.updater(state);
      } else {
        return reducer(state, action);
      }
    }, initialState, reduxDevTools && reduxDevTools());

    return new ReduxStore(store, () => store.getState(), rootValue => rootValue);
  }

  private sourceStore: SourceStore<RootValue>;
  private getter: () => Value;
  private updater: (update: (value: Value) => Value) => (rootValue: RootValue) => RootValue;

  private constructor(sourceStore: SourceStore<RootValue>,
                      getter: () => Value,
                      updater: (update: (value: Value) => Value) => (rootValue: RootValue) => RootValue) {
    this.sourceStore = sourceStore;
    this.getter = getter;
    this.updater = updater;
  }

  dispatch(a: Action): void {
    this.sourceStore.dispatch(a);
  }

  get(): Value {
    return this.getter();
  }

  update(update: (v: Value) => Value): void {
    this.sourceStore.dispatch({type: 'UPDATE', updater: this.updater(update)})
  }

  lens<ChildValue>(lens: Lens<Value, ChildValue>): Store<ChildValue> {
    return new ReduxStore<RootValue, ChildValue>(
        this.sourceStore,
        () => lens.get(this.get()),
        (update: (childValue: ChildValue) => ChildValue) => this.updater(value => lens.set(value, update(lens.get(value))))
    );
  }

  subscribe(listener: (v: RootValue) => void) {
    this.sourceStore.subscribe(() => listener(this.sourceStore.getState()))
  }
}