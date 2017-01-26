// @flow
import * as React from 'react';
import styles from './sheet.scss';
import PackeryFactory from 'react-packery-component';
import { MODULES } from 'components/modules/modules';
import type { ModuleAction, Module } from 'components/modules/modules';
import { List } from 'immutable';
import type { Character } from 'data/character';

export type SheetAction =
    | ModuleAction;

export type ModuleConfig = {
  id: number,
  type: string,
  state: any
}

export type Sheet = {
  modules: List<ModuleConfig>
}

export function reduce(state : Sheet = {modules: List()}, action : SheetAction) : Sheet {
  return {
    modules: state.modules.map(moduleConfig => {
      const module = MODULES.get(moduleConfig.type);
      if (action.moduleId === moduleConfig.id && module != null) {
        return {...moduleConfig, state: module.reduce(moduleConfig.state, action)}
      } else {
        return moduleConfig
      }
    })
  };
}

const Packery = PackeryFactory(React);

const packeryOptions = {
  itemSelector: '.' + styles.moduleContainer,
  columnWidth: '.' + styles.gridSizer,
  gutter: '.' + styles.gutterSizer,
  percentPosition: true
};

function SheetPresentation({ modules }) {
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

export class Sheets extends React.Component {
  props: { character: Character, state: Sheet };
  render() {
    const { modules } = this.props.state;
    return <SheetPresentation modules={modules.map(moduleConfig => {
      const module = MODULES.get(moduleConfig.type);
      if (module) {
        const Module = module.component;
        return <Module moduleId={moduleConfig.id} state={moduleConfig.state} character={this.props.character} />
      } else {
        return <div>Unknown module type {moduleConfig.type}</div>;
      }
    })}/>
  }
}