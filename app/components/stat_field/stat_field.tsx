import * as React from 'react';
import { Character, getStatValue, getOrCreateStat } from 'data/character';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { AppState } from 'data/app_state';
import * as styles from './stat_field.css';
import * as classnames from 'classnames';


@observer
export class StatField extends React.Component<{character: Character, appState: AppState, statId: string} ,{}> {

  render() {
    const { character, statId, appState } = this.props;
    const currentValue = getStatValue(character, statId);
    const active = appState.selectedStat && appState.selectedStat.id == statId;
    return (<div
        className={classnames(styles.field, { [styles.active]: active })}
        onClick={this.onClick}>
      {currentValue}
    </div>);
  }

  @action onClick = () => {
    this.props.appState.selectedStat = getOrCreateStat(this.props.character, this.props.statId);
  }
}