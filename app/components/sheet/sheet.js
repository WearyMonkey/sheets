import * as React from 'react';
import styles from './sheet.scss';
import PackeryFactory from 'react-packery-component';
import { MODULES } from '../modules/modules';
import { List } from 'immutable';

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

export function reduce(state = {modules: List()}, action) {
  return {
    modules: state.modules.map(m => action.moduleId == m.id
        ? {...m, state: MODULES[m.type].reduce(m.state, action) }
        : m)
  };
}

export class Sheets extends React.Component {
  render() {
    const { modules } = this.props.state;
    return <SheetPresentation modules={modules.map(m => {
      const Module = MODULES[m.type].component;
      return <Module moduleId={m.id} state={m.state} sheet={this.props.sheet} />
    })}/>
  }
}