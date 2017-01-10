import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import styles from './root.scss';
import { Sheet, reduce as sheet } from './sheet/sheet';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reduce as stats } from 'data/stats';

export class Root extends Component {

  constructor() {
    super();
    this.store = createStore(combineReducers({ sheet, stats }), {
      sheet: {
        modules: [
          {id: 'ATTRIBUTES', state: [
            {
              statId: 'strength',
              displayName: 'Strength',
            }
          ]}
        ]
      }
    }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  }

  render() {
    return <Provider store={this.store}>
      <div>
        <AppBar/>
        <div className={styles.containerOuter}>
          <div className={styles.containerInner}>
            <Sheet/>
          </div>
        </div>
      </div>
    </Provider>
  }
}