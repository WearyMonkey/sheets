import * as React from 'react';
import { Character, DiceRoll, getStatValue } from 'data/character';

type Props = {
  character: Character,
  diceRoll?: DiceRoll,
  rollNum: number
};

export class DiceRoller extends React.PureComponent<Props> {
  render() {
    const { diceRoll, character } = this.props;
    if (diceRoll) {
      const bonus = diceRoll.bonusStatId
          ? getStatValue(character, diceRoll.bonusStatId)
          : 0;
      const results = diceRoll.dice.map(die =>
          Array(die.dice)
              .fill(null)
              .map(_ => Math.ceil(Math.random() * die.sides)));
      const total = results.reduce((s, rolls) => s + rolls.reduce((s, r) => s + r, 0), 0) + bonus;
      return (
          <div style={{ paddingTop: 30 }}>
            {results.map((rolls, i) => (
                <div key={i}>
                  {rolls.map((r, j) => <span key={j}>{r} </span>)}
                </div>
            ))}
            <div>bonus: {bonus}</div>
            <div>total: {total}</div>
          </div>
      );
    } else {
      return null;
    }
  }
}