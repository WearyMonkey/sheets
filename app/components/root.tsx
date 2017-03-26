import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import { Character } from 'data/character';
import { Sheet } from 'data/sheet';
import * as styles from './root.css';
import { Sheets } from './sheet/sheet';
import DevTools from 'mobx-react-devtools';
import { generateId } from 'data/guid';
import { AppState } from 'data/app_state';
import { MODULES } from 'components/modules/modules';
import { TextState } from 'data/text_state';

export class Root extends React.Component<{}, {}> {

  character: Character;
  sheet: Sheet;
  appState: AppState;

  constructor() {
    super();

    this.character = new Character();
    this.character.abilities.push({
      id: '1', description: {type: 'TEXT', textState: TextState.createFromText('foo') }, actions: [
        { id: '1', type: 'ROLL', description: {type: 'TEXT', textState: TextState.createFromText('attack')}, diceRoll: { dice: [{ id: generateId(), sides: 20, dice: 1 }] } }
      ]
    });

    this.sheet = new Sheet();
    this.sheet.modules.push(
        { id: 2, type: 'GRID_MODULE', state: {
          title: 'Attributes',
          columns: [
            { type: 'LABEL', displayName: 'Attribute' },
            { type: 'STAT', displayName: 'Base' },
            { type: 'STAT', displayName: 'Mod' },
          ],
          rows: [
            { values: ['Strength', 'strength', 'strength_mod'] },
          ]
        } },
        { id: 3, type: 'ABILITIES_MODULE', state: {} },
    );
    this.sheet.modules.forEach(module => {
      MODULES.get(module.type)!.addToCharacter(this.character, module.id, module.state);
    });

    this.appState = new AppState();
  }

  componentDidMount() {
    window.onunload = function() {

    }
  }

  render() {
    return <div>
      <AppBar/>
      <div className={styles.containerOuter}>
        <div className={styles.containerInner}>
          <Sheets appState={this.appState} sheet={this.sheet} character={this.character} />
        </div>
      </div>
      <DevTools/>
    </div>
  }

  getChildContext() {
    return {
      reactIconBase: { size: '100%' }
    };
  }

  static childContextTypes = {
    reactIconBase: React.PropTypes.shape({
      size: React.PropTypes.string
    })
  };
}
