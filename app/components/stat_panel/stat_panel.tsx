import * as React from 'react';
import { observer } from 'mobx-react';
import { Stat, Character, getStatValue } from '../../data/character';
import TextField from 'material-ui/TextField';
import ChangeEvent = React.ChangeEvent;
import { ModifierCard } from '../modifier_card/modifier_card';

@observer
export class StatPanel extends React.Component<{ character: Character, stat: Stat }, {}> {
  render() {
    const { stat, character } = this.props;
    const value = getStatValue(character, stat.id);

    return (<div>
      <h2>{value}</h2>
      <TextField value={stat.id} onChange={this.onNameChange} />
      <div>
        {stat.modifiers.values().map(modifier => <ModifierCard modifier={modifier} />)}
      </div>
    </div>);
  }

  onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.stat.id = event.currentTarget.value;
  }
}