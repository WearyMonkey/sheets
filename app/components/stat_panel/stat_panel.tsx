import * as React from 'react';
import { observer } from 'mobx-react';
import { Stat, Character, getStatValue, Modifier } from 'data/character';
import TextField from 'material-ui/TextField';
import ChangeEvent = React.ChangeEvent;
import { ModifierCard } from 'components/modifier_card/modifier_card';
import { action } from 'mobx';
import * as styles from './stat_panel.css';
import FlatButton from 'material-ui/FlatButton';
import { generateId } from 'data/guid';

@observer
export class StatPanel extends React.Component<{ character: Character, stat: Stat }, {}> {
  render() {
    const { stat, character } = this.props;
    const value = getStatValue(character, stat.id);

    return (<div className={styles.panel}>
      <h1>{value}</h1>
      <TextField fullWidth={true} value={stat.id} onChange={this.onNameChange} hintText="Stat Id" />
      <div>
        {stat.modifiers.values().map((modifier, i) =>
          <div className={styles.modifierContainer}>
            <ModifierCard character={character} modifier={modifier} onDelete={() => this.onDeleteModifier(modifier)} />
          </div>
        )}
      </div>
      <FlatButton onClick={this.onAddModifier}>Add Modifier</FlatButton>
    </div>);
  }

  @action
  onAddModifier = () => {
    const id = generateId();
    this.props.stat.modifiers.set(id, { id, description: '', value: '0' });
  };

  @action
  onDeleteModifier = (modifier: Modifier) => {
    this.props.stat.modifiers.delete(modifier.id);
  };

  @action
  onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.stat.id = event.currentTarget.value;
  };
}