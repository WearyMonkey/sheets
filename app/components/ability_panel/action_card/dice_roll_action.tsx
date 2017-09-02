import * as React from 'react';
import { DiceRoll } from 'data/character';
import { observer } from 'mobx-react';
import NumberInput from 'material-ui-number-input';
import { VerticalTable } from 'components/vertical_table/vertical_table'
import { generateId } from 'data/guid';
import { action } from 'mobx';
import RaisedButton from 'material-ui/RaisedButton';
import ChangeEvent = React.ChangeEvent;

@observer
export class DiceRollAction extends React.Component<{diceRoll: DiceRoll, onRoll: (diceRoll: DiceRoll) => void }, {}> {
  render() {
    return (<div>
      <VerticalTable
          cols={[
          {displayName: 'Sides'},
          {displayName: 'Dice'},
        ]}
          rows={this.props.diceRoll.dice.map(({id, sides, dice, bonus}, i) => ({
          elements: [
              <NumberInput name={`sides_${id}`} defaultValue={sides} onChange={this.onSidesChange} data-index={i} />,
              <NumberInput name={`dice_${id}`} defaultValue={dice} onChange={this.onDiceChange} data-index={i} />,
          ]
        }))}
          onAddRow={this.onAddDie}
          onDeleteRow={this.onDeleteDie}
      />
      <RaisedButton onClick={this.onRoll}>Roll</RaisedButton>
    </div>);
  }

  @action
  onSidesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const dice = this.props.diceRoll.dice[Number(event.currentTarget.dataset.index)];
    dice.sides = Number(event.currentTarget.value);
  };

  @action
  onDiceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const dice = this.props.diceRoll.dice[Number(event.currentTarget.dataset.index)];
    dice.dice = Number(event.currentTarget.value);
  };

  @action
  onRoll = () => {
    this.props.onRoll(this.props.diceRoll);
  };

  @action
  onDeleteDie = (i: number) => {
    this.props.diceRoll.dice.splice(i, 1);
  };

  @action
  onAddDie = () => {
    this.props.diceRoll.dice.push({ id: generateId(), sides: 6, dice: 1 })
  }
}