import * as React from 'react';
import { Ability, DiceRoll, actionTypes } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { ActionCard } from './action_card/action_card';
import { observer } from 'mobx-react';
import { DiceRoller } from './dice_roller/dice_roller';
import { observable, action } from 'mobx';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { generateId } from 'data/guid';

@observer
export class AbilityPanel extends React.Component<{ ability: Ability }, {}>{

  @observable diceRoll: DiceRoll|null = null;
  @observable rollNum: number = 0;
  @observable addActionType: string = actionTypes[0].type;

  render() {
    const { ability } = this.props;
    return (<div>
      <DiceRoller diceRoll={this.diceRoll} rollNum={this.rollNum} />
      <DescriptionCard description={ability.description}/>
      <div>
        {ability.actions.map(action =>
          <ActionCard key={action.id} action={action} abilityPanelUiAction={this.handleAbilityPanelUiAction} />
        )}
      </div>
      <RaisedButton onClick={this.onAddAction}>Add Action</RaisedButton>
      <DropDownMenu value={this.addActionType} onChange={this.onTypeChange}>
        {actionTypes.map(actionType =>
          <MenuItem value={actionType.type} primaryText={actionType.displayName} />
        )}
      </DropDownMenu>
    </div>);
  }

  @action
  onTypeChange = (e: React.SyntheticEvent<{}>, index: number, menuItemValue: string) => {
    this.addActionType = menuItemValue;
  };

  @action
  onAddAction = () => {
    switch (this.addActionType) {
      case 'ROLL':
        this.props.ability.actions.push({
          type: 'ROLL',
          diceRoll: { dice: [] },
          id: generateId(),
          description: { type: 'TEXT' }
        });
        break;
      default:
        throw new Error(`Unknown action type ${this.addActionType}`);
    }
  };

  handleAbilityPanelUiAction = (diceRoll: DiceRoll) => {
    this.diceRoll = diceRoll;
    this.rollNum += 1;
  }
}