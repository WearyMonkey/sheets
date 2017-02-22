import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import { Character } from 'data/character';
import { Sheet } from 'data/sheet';
import * as styles from './root.css';
import { Sheets } from './sheet/sheet';
import DevTools from 'mobx-react-devtools';
import { generateId } from '../data/guid';

export class Root extends React.Component<{}, {}> {

  character: Character;
  sheet: Sheet;

  constructor() {
    super();

    this.character = new Character();
    this.character.addAbility({
      id: '1', description: {type: 'TEXT', value: 'foo'}, actions: [
        { id: '1', type: 'ROLL', description: {type: 'TEXT', value: 'Attack'}, diceRoll: { dice: [{ id: generateId(), sides: 20, dice: 1 }] } }
      ]
    });

    this.sheet = new Sheet();
    this.sheet.modules.push(
        { id: 1, type: 'ATTRIBUTES_MODULE', state: [{ id: '1', statId: 'strength', displayName: 'Strength' }] },
        { id: 2, type: 'ABILITIES_MODULE', state: {} },
    );
  }

  render() {
    return <div>
      <AppBar/>
      <div className={styles.containerOuter}>
        <div className={styles.containerInner}>
          <Sheets sheet={this.sheet} character={this.character} />
        </div>
      </div>
      <DevTools/>
    </div>
  }
}