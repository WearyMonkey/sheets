import * as React from 'react';
import { DiceRoll } from 'data/character';
import { observer } from 'mobx-react';
import NumberInput from 'material-ui-number-input';
import { VerticalTable } from 'components/common/vertical_table'
import { generateId } from 'data/guid';
import { action } from 'mobx';
import RaisedButton from 'material-ui/RaisedButton';

@observer
export class DiceRollAction extends React.Component<{diceRoll: DiceRoll, onRoll: (diceRoll: DiceRoll) => void }, {}> {
  render() {
    return (<div>
      <VerticalTable
          cols={[
          {displayName: 'Sides'},
          {displayName: 'Dice'},
          {displayName: 'Roll'},
        ]}
          rows={this.props.diceRoll.dice.map(({id, sides, dice, bonus}, i) => ({
          elements: [
              <NumberInput name={`sides_${id}`} defaultValue={sides} />,
              <NumberInput name={`dice_${id}`} defaultValue={dice} />,
          ],
          onDelete: this.onDeleteDie
        }))}
          onAdd={this.onAddDie}
      />
      <RaisedButton onClick={this.onRoll}>Roll</RaisedButton>
    </div>);
  }

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
    this.props.diceRoll.dice.push({ id: generateId(), sides: 6, dice: 1, bonus: null })
  }
}