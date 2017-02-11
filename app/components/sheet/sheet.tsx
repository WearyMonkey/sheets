import * as React from 'react';
import * as styles from './sheet.css';
import * as PackeryFactory from 'react-packery-component';
import { MODULES, Module } from 'components/modules/modules';
import {List, Iterable} from 'immutable';
import { Character } from 'data/character';
import { Store } from 'data/store';

export type ModuleConfig = {
  id: number,
  type: string,
  state: any
}

export type Sheet = {
  modules: List<ModuleConfig>
}

export class Sheets extends React.Component<{ character: Character, store: Store<Sheet> }, {}> {
  render() {
    const { store, character } = this.props;
    const { modules } = store.get();
    return <SheetPresentation modules={modules.map((moduleConfig : ModuleConfig, i : number) => {
      const module = MODULES.get(moduleConfig.type);
      if (module) {
        const Module = module.component;
        const childStore = store.lens({
          set: (sheet, childValue) => ({...sheet, modules: modules.set(i, {...moduleConfig, state: childValue}) }),
          get: () => moduleConfig.state
        });
        return <Module moduleId={moduleConfig.id} store={childStore} character={character} />
      } else {
        return <div>Unknown module type {moduleConfig.type}</div>;
      }
    })}/>
  }
}

function SheetPresentation({ modules } : { modules: Iterable<number, React.ReactElement<any>> }) {
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