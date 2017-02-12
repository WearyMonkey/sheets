import * as React from 'react';
import { Store } from 'data/store';
import { Action, Description } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';

export class ActionCard extends React.Component<{ actionStore: Store<Action> }, {}> {
  render() {
    const { actionStore } = this.props;
    return <div>
      <DescriptionCard descriptionStore={actionStore.lens<Description>({
        get: action => action.description,
        set: (action, description) => ({ ...action, description })
      })} />
    </div>
  }
}