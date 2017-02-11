import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import * as styles from './root.css';
import { Sheets, Sheet } from './sheet/sheet';
import { reduce as character, Modifier, Ability } from 'data/character';
import { CharacterAction, Character } from 'data/character';
import { BatchAction } from 'data/batch';
import { Map, List } from 'immutable';
import { MODULES } from './modules/modules';
import { makeBatch, batchReducer } from 'data/batch';
import { ReduxStore } from "data/store";

export type Action =
      CharacterAction
    | BatchAction;

type State = {sheet: Sheet, character: Character};

export class Root extends React.Component<{}, {}> {

  state: {state: State};
  store: ReduxStore<State, State>;

  constructor() {
    super();
    const defaultState: State = {
      sheet: {
        modules: List([
          {
            id: 1, type: 'ATTRIBUTES_MODULE', state: List([
            {
              statId: 'strength',
              displayName: 'Strength',
            }
          ])
          },
          // {id: 2, type: 'ABILITIES_MODULE', state: {}},
        ])
      },
      character: {
        stats: Map<string, Map<string, Modifier>>(),
        abilities: List<Ability>()
      }
    };

    this.store = ReduxStore.createRoot(batchReducer((state: State, action: Action) => ({
      ...state, character: character(state.character, action as CharacterAction)
    })), defaultState);
    const state = this.store.get();
    const initActions: Array<Action> = state.sheet.modules.map(moduleConfig =>
        MODULES.get(moduleConfig.type).addToSheet(state.character, moduleConfig.id, moduleConfig.state
        )).flatten().toArray();
    this.store.dispatch(makeBatch(initActions));
  }

  componentWillMount() {
    this.setState({state: this.store.get()});
    this.store.subscribe((state) => {
      this.setState({state: state});
    });
  }

  render() {
    const sheetStore = this.store.lens<Sheet>({
      get: state => state.sheet,
      set: (state, sheet) => ({...state, sheet})
    });
    return <div>
      <AppBar/>
      <div className={styles.containerOuter}>
        <div className={styles.containerInner}>
          <Sheets store={sheetStore} character={this.state.state.character}/>
        </div>
      </div>
    </div>
  }
}