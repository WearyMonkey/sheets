import * as React from 'react';
import { Ability } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { ActionCard } from './action_card/action_card';
import { observer } from 'mobx-react';

@observer
export class AbilityPanel extends React.Component<{ ability: Ability }, {}>{
  render() {
    const { ability } = this.props;
    return <div>
      <DescriptionCard description={ability.description} />
      <div>
        {ability.actions.map((action, i) => {
          return <ActionCard key={action.id} action={action} />
        })}
      </div>
    </div>
  }
}