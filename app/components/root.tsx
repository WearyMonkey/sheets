import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import { Character } from 'data/character';
import { Sheet } from 'data/sheet';
import * as styles from './root.css';
import { Sheets } from './sheet/sheet';
import { AppState } from 'data/app_state';

type Props = {
  character: Character,
  sheet: Sheet,
  appState: AppState,
}

export class Root extends React.Component<Props> {

  render() {
    const { appState, sheet, character } = this.props;
    return (
        <div>
          <AppBar className={styles.appBar}/>
          <div className={styles.containerOuter}>
            <div className={styles.containerInner}>
              <Sheets {...{ appState, sheet, character }} />
            </div>
          </div>
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
