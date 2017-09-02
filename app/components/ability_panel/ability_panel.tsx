import * as React from 'react';
import { Ability, actionTypes, DiceRoll } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { ActionCard } from './action_card/action_card';
import { observer } from 'mobx-react';
import { DiceRoller } from './dice_roller/dice_roller';
import { action, observable } from 'mobx';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { generateId } from 'data/guid';

type Props = {
  ability: Ability,
  onDelete(ability: Ability): void
}

@observer
export class AbilityPanel extends React.Component<Props, {}> {

  @observable diceRoll?: DiceRoll;
  @observable rollNum: number = 0;
  @observable addActionType: string = actionTypes[ 0 ].type;

  render() {
    const { ability } = this.props;
    return (
        <div>
          <DiceRoller diceRoll={this.diceRoll} rollNum={this.rollNum}/>
          <DescriptionCard description={ability.description}/>
          <div>
            {ability.actions.map(action =>
                <ActionCard key={action.id} action={action} abilityPanelUiAction={this.handleAbilityPanelUiAction}/>
            )}
          </div>
          <RaisedButton onClick={this.onAddAction}>Add Action</RaisedButton>
          <DropDownMenu value={this.addActionType} onChange={this.onTypeChange}>
            {actionTypes.map(actionType =>
                <MenuItem value={actionType.type} primaryText={actionType.displayName}/>
            )}
          </DropDownMenu>
          <RaisedButton onClick={this.onDelete}>Delete</RaisedButton>
        </div>
    );
  }

  @action
  private readonly onTypeChange = (e: React.SyntheticEvent<{}>, index: number, menuItemValue: string) => {
    this.addActionType = menuItemValue;
  };

  @action
  private readonly onDelete = () => {
    this.props.onDelete(this.props.ability);
  };

  @action
  private readonly onAddAction = () => {
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

  private readonly handleAbilityPanelUiAction = (diceRoll: DiceRoll) => {
    this.diceRoll = diceRoll;
    this.rollNum += 1;
  }
}