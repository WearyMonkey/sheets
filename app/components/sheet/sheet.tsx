import * as React from 'react';
import * as styles from './sheet.css';
import * as PackeryFactory from 'react-packery-component';
import { MODULES } from 'components/modules/modules';
import {List, Iterable} from 'immutable';
// import { Drawer } from "material-ui";
// import { AbilityPanel } from 'components/ability_panel/ability_panel';
import { connect } from 'react-redux';
import { State } from 'components/root';
import { Lens, Store } from '../../data/lens';

export type SheetUiAction =
    { type: 'ABILITY_SELECTED', abilityId: string } |
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

type Props = { modules: Iterable<number, React.ReactElement<any>> };

function stateToProps(state: State, { lens } : { lens: Store<Sheet> }) : Props {
  const modules = lens.get(state).modules.map((moduleConfig : ModuleConfig) => {
    const module = MODULES.get(moduleConfig.type);
    if (module) {
      const Module = module.component;
      return <Module moduleId={moduleConfig.id} />
    } else {
      return <div>Unknown module type {moduleConfig.type}</div>;
    }
  });
  return { modules };
}


export const Sheets = connect(stateToProps)(SheetPresentation);


function SheetPresentation({ modules } : Props) {
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
  </div>
}

const Packery = PackeryFactory(React);

const packeryOptions = {
  itemSelector: '.' + styles.moduleContainer,
  columnWidth: '.' + styles.gridSizer,
  gutter: '.' + styles.gutterSizer,
  percentPosition: true
};