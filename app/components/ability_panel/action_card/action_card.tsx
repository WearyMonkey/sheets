import * as React from 'react';
import { Action, DiceRoll } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { observer } from 'mobx-react';
import { DiceRollAction } from './dice_roll_action';

type Props = {
  action: Action,
  abilityPanelUiAction(action: DiceRoll): void
};

@observer
export class ActionCard extends React.Component<Props, {}> {
  render() {
    const { action } = this.props;
    return (
        <div>
          <DescriptionCard description={action.description}/>
          {this.renderAction(action)}
        </div>
    );
  }

  private renderAction(action: Action) {
    switch (action.type) {
      case 'ROLL':
        return <DiceRollAction onRoll={this.props.abilityPanelUiAction} diceRoll={action.diceRoll}/>;
      default:
        throw new Error(`Unknown action type ${action.type}`);
    }
  }
}