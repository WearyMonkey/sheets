import * as React from 'react';
import { Ability, actionTypes, Character, DiceRoll } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { ActionCard } from './action_card/action_card';
import { observer } from 'mobx-react';
import { DiceRoller } from './dice_roller/dice_roller';
import { action, observable } from 'mobx';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { generateId } from 'data/guid';
import { ModifierCard } from "../modifier_card/modifier_card";
import { AppState } from "../../data/app_state";

type Props = {
  appState: AppState,
  character: Character,
  ability: Ability,
  onDelete(ability: Ability): void
}

@observer
export class AbilityPanel extends React.Component<Props> {

  @observable private diceRoll?: DiceRoll;
  @observable private rollNum: number = 0;
  @observable private addActionType: string = actionTypes[0].type;

  render() {
    const { character, ability, appState } = this.props;
    const modifiers = character.modifiers.filter(m => m.sourceType == 'ABILITY' && m.sourceId == ability.id);
    return (
        <div>
          <DiceRoller character={character} diceRoll={this.diceRoll} rollNum={this.rollNum}/>
          <DescriptionCard description={ability.description}/>
          <div>
            {ability.actions.map(action =>
                <ActionCard
                    {...{ character, action, appState }}
                    key={action.id}
                    abilityPanelUiAction={this.handleAbilityPanelUiAction}/>
            )}
          </div>
          <RaisedButton onClick={this.onAddAction}>Add Action</RaisedButton>
          <DropDownMenu value={this.addActionType} onChange={this.onTypeChange}>
            {actionTypes.map((actionType, i) =>
                <MenuItem key={i} value={actionType.type} primaryText={actionType.displayName}/>
            )}
          </DropDownMenu>
          <div>
            {modifiers.map(modifier => (
                <ModifierCard key={modifier.id} {...{ character, modifier, showStatId: true }} />
            ))}
          </div>
          <RaisedButton onClick={this.onAddModifier}>Add Modifier</RaisedButton>
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
  private readonly onAddModifier = () => {
    this.props.character.modifiers.push({
      id: generateId(),
      statId: '',
      sourceId: this.props.ability.id,
      sourceType: 'ABILITY',
      description: { type: 'TEXT', textState: undefined, imageUrl: undefined },
      value: '',
    });
  };

  @action
  private readonly onAddAction = () => {
    switch (this.addActionType) {
      case 'ROLL':
        this.props.ability.actions.push({
          type: 'ROLL',
          diceRoll: { dice: [], bonusStatId: undefined },
          id: generateId(),
          description: { type: 'TEXT', textState: undefined, imageUrl: undefined },
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