import * as React from 'react';
import { Description } from 'data/character';
import TextField from 'material-ui/TextField';
import { Store } from '../../data/store';
import { PureStoreComponent } from '../pure_store_component';

export class DescriptionCard extends PureStoreComponent<{ descriptionStore: Store<Description> }, {}> {

  render() {
    const { descriptionStore } = this.props;
    const description = descriptionStore.get();
    switch (description.type) {
      case 'IMAGE':
        return <img src={description.url} />;
      case 'TEXT':
        return <input type="text" onChange={e => this.handleChange(e.currentTarget.value)} value={description.value} />
    }
  }

  handleChange(value: string) {
    const { descriptionStore } = this.props;
    descriptionStore.update('SET_DESCRIPTION', description => ({...description, value}));
  }
}