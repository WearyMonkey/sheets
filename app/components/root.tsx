import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import { Character } from 'data/character';
import { characterFromJson, characterToJson } from 'data/character_serialization';
import { Sheet, sheetFromJson, sheetToJson } from 'data/sheet';
import * as styles from './root.css';
import { Sheets } from './sheet/sheet';
import DevTools from 'mobx-react-devtools';
import { AppState } from 'data/app_state';

export class Root extends React.Component<{}, {}> {

  character: Character;
  sheet: Sheet;
  appState: AppState;

  constructor() {
    super();

    if (localStorage.character && localStorage.sheet) {
      this.character = characterFromJson(JSON.parse(localStorage.character));
      this.sheet = sheetFromJson(JSON.parse(localStorage.sheet));
    } else {
      this.character = new Character();
      this.sheet = new Sheet();
    }

    this.appState = new AppState();
  }

  componentDidMount() {
    window.onunload = () => {
      localStorage.setItem('character', JSON.stringify(characterToJson(this.character)));
      localStorage.setItem('sheet', JSON.stringify(sheetToJson(this.sheet)));
    }
  }

  render() {
    return (
        <div>
          <AppBar/>
          <div className={styles.containerOuter}>
            <div className={styles.containerInner}>
              <Sheets appState={this.appState} sheet={this.sheet} character={this.character}/>
            </div>
          </div>
          <DevTools/>
        </div>
    );
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
