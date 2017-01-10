import * as React from 'react';
import styles from './sheet.scss';
import PackeryFactory from 'react-packery-component';
import { MODULES } from 'components/modules/modules';
import { List } from 'immutable';
import { connect } from 'react-redux';

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
          {m.component}
        </div>
      })}
    </Packery>
  </div>
}

export const Sheet = connect(state => ({
  modules: state.sheet.modules.map(m => ({component: MODULES[m.id].component}))
}))(SheetPresentation);

export function reduce(state = { modules: List() }, action) {
  return {
    modules: state.modules.map(m => ({id: m.id, state: MODULES[m.id].reduce(m.state, action)}))
  };
}