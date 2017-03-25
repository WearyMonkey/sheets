import * as React from 'react';
import { Character, getStatValue, getOrCreateStat } from 'data/character';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { AppState } from 'data/app_state';

@observer
export class StatField extends React.Component<{character: Character, appState: AppState, statId: string} ,{}> {

  render() {
    const { character, statId } = this.props;
    const currentValue = getStatValue(character, statId);
    return (<span style={{cursor: 'pointer'}} onClick={this.onClick}>{currentValue}</span>)
  }

  @action onClick = () => {
    this.props.appState.selectedStat = getOrCreateStat(this.props.character, this.props.statId);
  }
}