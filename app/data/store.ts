import { Store as SourceStore, createStore } from 'redux';

export interface Lens<ParentValue, ChildValue> {
  set(pv: ParentValue, cv: ChildValue): ParentValue;
  get(pv: ParentValue): ChildValue;
}

export interface Store<Value> {
  get(): Value;
  dispatch(a: any): void;
  update(description: string, updater: (v: Value) => Value): void;
  lens<ChildValue>(lens: Lens<Value, ChildValue>): Store<ChildValue>
}

export class ReduxStore<RootValue, Value> implements Store<Value> {

  static createRoot<State>(reducer: (s: State, a: any) => State, cb: (store: Store<State>) => void, initialState?: State) : Store<State> {
    const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

    const store = createStore((state: State, action: any) => {
      if (action.isUpdate) {
        return action.updater(state);
      } else {
        return reducer(state, action);
      }
    }, initialState, reduxDevTools && reduxDevTools());

    store.subscribe(() => {
      cb(new ReduxStore(store, store.getState(), rootValue => rootValue));
    });
    return new ReduxStore(store, store.getState(), rootValue => rootValue);
  }

  private sourceStore: SourceStore<RootValue>;
  private value: Value;
  private updater: (update: (value: Value) => Value) => (rootValue: RootValue) => RootValue;

  private constructor(sourceStore: SourceStore<RootValue>,
                      value: Value,
                      updater: (update: (value: Value) => Value) => (rootValue: RootValue) => RootValue) {
    this.sourceStore = sourceStore;
    this.value = value;
    this.updater = updater;
  }

  dispatch(a: any): void {
    this.sourceStore.dispatch(a);
  }

  get(): Value {
    return this.value;
  }

  update(description: string, update: (v: Value) => Value): void {
    this.sourceStore.dispatch({type: description, isUpdate: true, updater: this.updater(update)})
  }

  lens<ChildValue>(lens: Lens<Value, ChildValue>): Store<ChildValue> {
    return new ReduxStore<RootValue, ChildValue>(
        this.sourceStore,
        lens.get(this.get()),
        (update: (childValue: ChildValue) => ChildValue) => this.updater(value => lens.set(value, update(lens.get(value))))
    );
  }
}