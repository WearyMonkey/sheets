import * as React from 'react';
import { Store, ReduxStore } from '../data/store';

export class PureStoreComponent<S, P> extends React.PureComponent<S, P> {
  shouldComponentUpdate(nextProps : any, nextState : any) : boolean {
    nextProps = nextProps || {};
    nextState = nextState || {};
    const props = this.props as any || {};
    const state = this.state as any || {};
    const propKeys = Object.keys(props);
    const nextPropKeys = Object.keys(nextProps);
    const stateKeys = Object.keys(state);
    const nextStateKeys = Object.keys(nextState);

    if (propKeys.length !== nextPropKeys.length
        || stateKeys.length != nextStateKeys.length) {
      return false;
    }

    const e = !propKeys.every(key => equal(nextProps[key], props[key]))
        || !stateKeys.every(key => equal(nextProps[key], state[key]));

    console.log(props.descriptionStore.get(), nextProps.descriptionStore.get(), e);

    return e;

    function equal(val1 : any, val2 : any) : boolean {
      if (val1 instanceof ReduxStore && val2 instanceof ReduxStore) {
        return val1.get() === val2.get();
      } else {
        return val1 === val2;
      }
    }
  }
}