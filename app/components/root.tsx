import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import * as styles from './root.css';
import { Sheets, Sheet, ModuleConfig } from './sheet/sheet';
import { Modifier, Ability, Character, Action, Bonus } from 'data/character';
import { Map, List } from 'immutable';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux'

export type State = {sheet: Sheet, character: Character};

export class Root extends React.Component<{}, {}> {

  private store: Store<State>;

  constructor() {
    super();
    const defaultState: State = {
      sheet: {
        modules: List<ModuleConfig>().push(
          { id: 1, type: 'ATTRIBUTES_MODULE', state: List().push({ id: '1', statId: 'strength', displayName: 'Strength'}) },
          { id: 2, type: 'ABILITIES_MODULE', state: {} },
        )
      },
      character: {
        stats: Map<string, Map<string, Modifier>>(),
        abilities: List<Ability>().push(
            { id: '1', description: { type: 'TEXT', value: 'foo' }, actions: List<Action>().push(
                { id: '1', type: 'ROLL', description: { type: 'TEXT', value: 'Attack' }, diceRoll: { dice: List<{ sides: number, dice: number, bonus?: Bonus }>().push(
                    { sides: 20, dice: 1 }
                ) } }
            ) },
            { id: '2', description: { type: 'TEXT', value: 'baa' }, actions: List<Action>() },
        )
      }
    };

    const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
    this.store = createStore(function reduce(state: State, action: any) {
      if (action.type == 'BATCH') {
        return action.actions.reduce((s : State, action : Action) => {
          return reduce(s, action);
        }, state);
      } else if (action.isUpdate) {
        return action.update(state);
      } else {
        return state;
      }
    }, defaultState, reduxDevTools && reduxDevTools());
  }

  render() {
    return (<Provider store={this.store}>
      <div>
        <AppBar/>
        <div className={styles.containerOuter}>
          <div className={styles.containerInner}>
            <Sheets/>
          </div>
        </div>
      </div>
    </Provider>)
  }
}