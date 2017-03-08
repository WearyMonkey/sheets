import * as React from 'react';
import { Action, actionTypes, DiceRoll } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { observer } from 'mobx-react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { action } from 'mobx';
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
      <DropDownMenu value={action.type} onChange={this.handleTypeChange}>
        {actionTypes.map(actionType =>
            <MenuItem value={actionType.type} primaryText={actionType.displayName} />
        )}
      </DropDownMenu>
      {actionWidget}
    </div>
  }

  @action
  handleTypeChange = (e: React.SyntheticEvent<{}>, index: number, menuItemValue: string) => {
    switch (menuItemValue) {
      case 'ROLL':
        this.props.action.type = 'ROLL';
        break;
      default:
        throw new Error(`Unknown action type ${menuItemValue}`);
    }

  }
}