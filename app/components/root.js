// @flow
import React from 'react';
import AppBar from 'material-ui/AppBar';
import styles from './root.scss';
import { Sheets, reduce as sheet } from './sheet/sheet';
import type { SheetAction, Sheet } from './sheet/sheet';
import { createStore, combineReducers } from 'redux';
import type { Store } from 'redux';
import { reduce as character } from 'data/character';
import type { CharacterAction, Character } from 'data/character';
import { batchReducer } from 'data/batch';
import type { BatchAction } from 'data/batch';
import { PropTypes } from 'react'
import { Map, List } from 'immutable';
import { MODULES } from './modules/modules';
import { makeBatch } from 'data/batch';

export type Action =
    | SheetAction
    | CharacterAction
    | BatchAction;

type State = { sheet: Sheet, character: Character };

export class Root extends React.Component {

  state: { state: State };
  store : Store<State, Action>;

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
        stats: Map(),
        abilities: List()
      }
    };
    this.store = createStore(batchReducer(combineReducers({ sheet, character })), defaultState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    const state = this.store.getState();
    const initActions = state.sheet.modules.flatMap(moduleConfig =>
      MODULES.get(moduleConfig.type).addToSheet(state.character, moduleConfig.id, moduleConfig.state)
    );
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
}

Root.childContextTypes = {
  dispatch: PropTypes.func.isRequired
};