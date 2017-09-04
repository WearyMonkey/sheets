//@flow
import * as React from 'react';
import * as ReactDom from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './reset.css';
import { Root } from 'components/root';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { autorun, useStrict } from 'mobx';
import DevTools from 'mobx-react-devtools';
import { Sheet, sheetFromJson, sheetToJson } from "./data/sheet";
import { Character } from "./data/character";
import { characterFromJson, characterToJson } from "./data/character_serialization";
import { AppState } from "./data/app_state";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
useStrict(true);

const character = localStorage.character
    ? characterFromJson(JSON.parse(localStorage.character))
    : new Character([], []);

const sheet = localStorage.sheet
    ? sheetFromJson(JSON.parse(localStorage.sheet))
    : new Sheet([]);


const appState = new AppState();

window.onunload = () => {
  localStorage.setItem('character', JSON.stringify(characterToJson(character)));
  localStorage.setItem('sheet', JSON.stringify(sheetToJson(sheet)));
};

const root = document.getElementById('root');
if (root) {
  ReactDom.render((
      <div>
        <MuiThemeProvider>
          <Root {...{ character, sheet, appState }}/>
        </MuiThemeProvider>
        {process.env.NODE_ENV !== 'production' &&  <DevTools/>}
      </div>
  ), root);
}
