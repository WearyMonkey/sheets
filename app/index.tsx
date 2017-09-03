//@flow
import * as React from 'react';
import * as ReactDom from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './reset.css';
import { Root } from 'components/root';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { useStrict } from 'mobx';
import DevTools from 'mobx-react-devtools';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
useStrict(true);

const root = document.getElementById('root');
if (root) {
  ReactDom.render((
      <div>
        <MuiThemeProvider>
          <Root/>
        </MuiThemeProvider>
        {process.env.NODE_ENV !== 'production' &&  <DevTools/>}
      </div>
  ), root);
}