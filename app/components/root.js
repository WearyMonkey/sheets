import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import styles from './root.scss';
import { Sheets, reduce as sheet } from './sheet/sheet';
import { createStore, combineReducers } from 'redux';
import { reduce as stats } from 'data/stats';
import { PropTypes } from 'react'

export class Root extends Component {

  constructor() {
    super();
    this.store = createStore(combineReducers({ sheet, stats }), {
      sheet: {
        modules: [
          {id: 1, type: 'ATTRIBUTES_MODULE', state: [
            {
              statId: 'strength',
              displayName: 'Strength',
            }
          ]}
        ]
      }
    }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
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
          <Sheets state={this.state.state.sheet} sheet={this.state.state.stats} />
        </div>
      </div>
    </div>
  }
}

Root.childContextTypes = {
  dispatch: PropTypes.func.isRequired
};