import * as React from 'react';
import { DiceRoll } from 'data/character';

export class DiceRoller extends React.PureComponent<{ diceRoll: DiceRoll|null, rollNum: number }, {}> {
  render() {
    const diceRoll = this.props.diceRoll;
    if (diceRoll) {
      const results = diceRoll.dice.map(die => Array(die.dice).fill(null).map(_ => Math.ceil(Math.random() * die.sides)));
      const total = results.reduce((s, rolls) => s + rolls.reduce((s, r) => s + r, 0), 0);
      return (<div style={{paddingTop: 30}}>
        {results.map(rolls => (<div>
          {rolls.map(r => <span>{r} </span>)}
        </div>))}
        <span>total: {total}</span>
      </div>);
    } else {
      return null;
    }
  }
}