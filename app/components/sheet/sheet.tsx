import * as React from 'react';
import * as styles from './sheet.css';
import * as PackeryFactory from 'react-packery-component';
import { MODULES } from 'components/modules/modules';
import {List, Iterable} from 'immutable';
import { CharacterStore, Ability } from 'data/character';
import { Store } from 'data/store';
import { Drawer } from "material-ui";
import { AbilityPanel } from 'components/ability_panel/ability_panel';

export type SheetUiAction =
    { type: 'ABILITY_SELECTED', abilityStore: Store<Ability> } |
    { type: 'STAT_SELECTED', statId: string }

export type SheetUiActionCallback = (action : SheetUiAction) => void;

export type ModuleConfig = {
  id: number,
  type: string,
  state: any
}

export type Sheet = {
  modules: List<ModuleConfig>
}

export class Sheets extends React.Component<{ characterStore: CharacterStore, store: Store<Sheet> }, { selectedAbility?: Store<Ability> }> {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { selectedAbility } = this.state;
    const { store, characterStore } = this.props;
    const modules = store.get().modules.map((moduleConfig : ModuleConfig, i : number) => {
      const module = MODULES.get(moduleConfig.type);
      if (module) {
        const Module = module.component;
        const childStore: Store<any> = store.lens({
          set: (sheet, state) => ({...sheet, modules: sheet.modules.set(i, {...moduleConfig, state }) }),
          get: (sheet) => sheet.modules.get(i).state
        });
        return <Module moduleId={moduleConfig.id} store={childStore} characterStore={characterStore} sheetUiAction={this.handleUiAction.bind(this)} />
      } else {
        return <div>Unknown module type {moduleConfig.type}</div>;
      }
    });
    return <SheetPresentation modules={modules} selectedAbility={selectedAbility} />
  }

  handleUiAction(action: SheetUiAction) {
    switch (action.type) {
      case 'ABILITY_SELECTED':
        this.setState({ selectedAbility: action.abilityStore });
        break;
      case 'STAT_SELECTED': {

        break;
      }
    }
  }
}

function SheetPresentation({ modules, selectedAbility } : { modules: Iterable<number, React.ReactElement<any>>, selectedAbility?: Store<Ability> }) {
  return <div className={styles.root}>
    <Packery options={packeryOptions} className="sheets">
      <div className={styles.gutterSizer}></div>
      <div className={styles.gridSizer}></div>
      {modules.map((m, id) => {
        return <div className={styles.moduleContainer} key={id}>
          {m}
        </div>
      })}
    </Packery>
    <Drawer width={200} openSecondary={true} open={!!selectedAbility}>
      {!!selectedAbility &&
        <AbilityPanel abilityStore={selectedAbility} />
      }
    </Drawer>
  </div>
}

const Packery = PackeryFactory(React);

const packeryOptions = {
  itemSelector: '.' + styles.moduleContainer,
  columnWidth: '.' + styles.gridSizer,
  gutter: '.' + styles.gutterSizer,
  percentPosition: true
};