import * as React from 'react';
import { Action } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { observer } from 'mobx-react';

@observer
export class ActionCard extends React.Component<{ action: Action }, {}> {
  render() {
    const { action } = this.props;
    return <div>
      <DescriptionCard description={action.description} />
    </div>
  }
}