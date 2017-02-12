import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import * as styles from './root.css';
import { Sheets, Sheet, ModuleConfig } from './sheet/sheet';
import { Modifier, Ability, Character, CharacterStore, Action, Bonus } from 'data/character';
import { Map, List } from 'immutable';
import { MODULES } from './modules/modules';
import { ReduxStore, Store } from "data/store";

type State = {sheet: Sheet, character: Character};

export class Root extends React.Component<{}, {}> {

  private store: ReduxStore<State, State>;
  private sheetStore: Store<Sheet>;
  private characterStore: CharacterStore;

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

    this.store = ReduxStore.createRoot((state: State, action) => state, defaultState);
    const state = this.store.get();
    this.sheetStore = this.store.lens<Sheet>({
      get: state => state.sheet,
      set: (state, sheet) => ({...state, sheet})
    });
    this.characterStore = new CharacterStore(this.store.lens<Character>({
      get: state => state.character,
      set: (state, character) => ({...state, character})
    }));
    state.sheet.modules.forEach(moduleConfig =>
      MODULES.get(moduleConfig.type).addToSheet(this.characterStore, moduleConfig.id, moduleConfig.state)
    );
  }

  componentWillMount() {
    this.setState({state: this.store.get()});
    this.store.subscribe((state) => {
      this.setState({state: state});
    });
  }

  render() {
    this.sheetStore = this.store.lens<Sheet>({
      get: state => state.sheet,
      set: (state, sheet) => ({...state, sheet})
    });
    this.characterStore = new CharacterStore(this.store.lens<Character>({
      get: state => state.character,
      set: (state, character) => ({...state, character})
    }));
    return <div>
      <AppBar/>
      <div className={styles.containerOuter}>
        <div className={styles.containerInner}>
          <Sheets store={this.sheetStore} characterStore={this.characterStore}/>
        </div>
      </div>
    </div>
  }
}