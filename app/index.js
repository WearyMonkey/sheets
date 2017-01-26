// @flow
import * as React from 'react';
import * as ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './reset.scss';
import { Root } from 'components/root';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDom.render(<MuiThemeProvider><Root/></MuiThemeProvider>, document.getElementById('root'));