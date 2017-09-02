import * as React from 'react';
import { Character, getStatValue } from 'data/character';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { AppState } from 'data/app_state';
import * as styles from './stat_field.css';
import * as classnames from 'classnames';

type Props = {
  character: Character,
  appState: AppState,
  statId: string,
  onStatIdChange(statId: string): void
};

@observer
export class StatField extends React.Component<Props, {}> {

  render() {
    const { character, statId, appState } = this.props;
    const currentValue = getStatValue(character, statId);
    const active = appState.selectedStatId == statId;
    return (
        <div
            className={classnames(styles.field, { [styles.active]: active })}
            onClick={this.onClick}>
          {currentValue}
        </div>
    );
  }

  @action
  private readonly onClick = () => {
    this.props.appState.selectedStatId = this.props.statId;
    this.props.appState.onStatIdChange = (statId: string) => {
      this.props.appState.selectedStatId = statId;
      this.props.onStatIdChange(statId);
    };
  }
}