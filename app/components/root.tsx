import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import * as styles from './root.css';
import { Sheets, reduce as sheet } from './sheet/sheet';
import { SheetAction, Sheet } from './sheet/sheet';
import { createStore, combineReducers } from 'redux';
import { Store } from 'redux';
import { reduce as character, Modifier, Ability } from 'data/character';
import { CharacterAction, Character } from 'data/character';
import { batchReducer } from 'data/batch';
import { BatchAction } from 'data/batch';
import { PropTypes } from 'react'
import { Map, List } from 'immutable';
import { MODULES } from './modules/modules';
import { makeBatch } from 'data/batch';

export type Action =
      SheetAction
    | CharacterAction
    | BatchAction;

type State = { sheet: Sheet, character: Character };

export class Root extends React.Component<{}, {}> {

  state: { state: State };
  store : Store<State>;

  constructor() {
    super();
    const defaultState: State = {
      sheet: {
        modules: List([
          {id: 1, type: 'ATTRIBUTES_MODULE', state: List([
            {
              statId: 'strength',
              displayName: 'Strength',
            }
          ])},
          {id: 2, type: 'ABILITIES_MODULE', state: {}}
        ])
      },
      character: {
        stats: Map<string, Map<string, Modifier>>(),
        abilities: List<Ability>()
      }
    };
    const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
    this.store = createStore(batchReducer<State>(combineReducers<State>({ sheet, character })), defaultState, reduxDevTools && reduxDevTools());
    const state = this.store.getState();
    const initActions : Array<Action> = state.sheet.modules.map(moduleConfig =>
      MODULES.get(moduleConfig.type).addToSheet(state.character, moduleConfig.id, moduleConfig.state
    )).flatten().toArray();
    this.store.dispatch(makeBatch(initActions));
  }

  componentWillMount() {
    this.setState({ state: this.store.getState() });
    this.store.subscribe(() => {
      this.setState({ state: this.store.getState() });
    });
  }

  getChildContext() {
    return { dispatch: this.store.dispatch };
  }

  render() {
    return <div>
      <AppBar/>
      <div className={styles.containerOuter}>
        <div className={styles.containerInner}>
          <Sheets state={this.state.state.sheet} character={this.state.state.character} />
        </div>
      </div>
    </div>
  }

  static childContextTypes = {
    dispatch: PropTypes.func.isRequired
  };
}