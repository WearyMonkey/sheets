import * as React from 'react';
import { Action, DiceRoll } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { observer } from 'mobx-react';
import { DiceRollAction } from './dice_roll_action';

@observer
export class ActionCard extends React.Component<{ action: Action, abilityPanelUiAction: (action: DiceRoll) => void }, {}> {
  render() {
    const { action } = this.props;
    let actionWidget : React.ReactElement<{}>;
    switch (action.type) {
      case 'ROLL':
        actionWidget = <DiceRollAction onRoll={this.props.abilityPanelUiAction} diceRoll={action.diceRoll} />;
        break;
      default:
        throw new Error(`Unknown action type ${action.type}`);
    }
    return <div>
      <DescriptionCard description={action.description} />
      {actionWidget}
    </div>
  }
}