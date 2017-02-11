// @flow
import * as React from 'react';
import * as ReactDom from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './reset.css';
import { Root } from 'components/root';
import injectTapEventPlugin = require("react-tap-event-plugin");

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
// injectTapEventPlugin();

const root = document.getElementById('root');
if (root) {
    ReactDom.render(<MuiThemeProvider><Root /></MuiThemeProvider>, root);
}