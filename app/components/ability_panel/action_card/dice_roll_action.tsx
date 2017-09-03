import * as React from 'react';
import { Character, DiceRoll } from 'data/character';
import { observer } from 'mobx-react';
import NumberInput from 'material-ui-number-input';
import { VerticalTable } from 'components/vertical_table/vertical_table'
import { generateId } from 'data/guid';
import { action } from 'mobx';
import RaisedButton from 'material-ui/RaisedButton';
import { StatField } from "../../stat_field/stat_field";
import { AppState } from "../../../data/app_state";
import ChangeEvent = React.ChangeEvent;

type Props = {
  character: Character,
  diceRoll: DiceRoll,
  appState: AppState,
  onRoll(diceRoll: DiceRoll): void
};

@observer
export class DiceRollAction extends React.Component<Props> {
  render() {
    const { character, appState } = this.props;
    const statId = this.props.diceRoll.bonusStatId || '';
    return (
        <div>
          <VerticalTable
              editMode={true}
              cols={[
                { displayName: 'Sides' },
                { displayName: 'Dice' },
              ]}
              rows={this.props.diceRoll.dice.map(({ id, sides, dice }, i) => ({
                elements: [
                  <NumberInput name={`sides_${id}`} defaultValue={sides} onChange={this.onSidesChange} data-index={i}/>,
                  <NumberInput name={`dice_${id}`} defaultValue={dice} onChange={this.onDiceChange} data-index={i}/>,
                ]
              }))}
              onAddRow={this.onAddDie}
              onDeleteRow={this.onDeleteDie}
          />
          <StatField {...{ character, appState, statId, onStatIdChange: this.onBonusStatIdChange }} />
          <RaisedButton onClick={this.onRoll}>Roll</RaisedButton>
        </div>
    );
  }

  @action
  private readonly onBonusStatIdChange = (statId: string) => {
    this.props.diceRoll.bonusStatId = statId;
  };

  @action
  private readonly onSidesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const dice = this.props.diceRoll.dice[Number(event.currentTarget.dataset.index)];
    dice.sides = Number(event.currentTarget.value);
  };

  @action
  private readonly onDiceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const dice = this.props.diceRoll.dice[Number(event.currentTarget.dataset.index)];
    dice.dice = Number(event.currentTarget.value);
  };

  @action
  private readonly onRoll = () => {
    this.props.onRoll(this.props.diceRoll);
  };

  @action
  private readonly onDeleteDie = (i: number) => {
    this.props.diceRoll.dice.splice(i, 1);
  };

  @action
  private readonly onAddDie = () => {
    this.props.diceRoll.dice.push({ id: generateId(), sides: 6, dice: 1 })
  }
}