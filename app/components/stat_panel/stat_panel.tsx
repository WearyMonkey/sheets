import * as React from 'react';
import { observer } from 'mobx-react';
import { Character, getStatValue, Modifier, getOrCreateStat } from 'data/character';
import TextField from 'material-ui/TextField';
import ChangeEvent = React.ChangeEvent;
import { ModifierCard } from 'components/modifier_card/modifier_card';
import { action } from 'mobx';
import * as styles from './stat_panel.css';
import FlatButton from 'material-ui/FlatButton';
import { generateId } from 'data/guid';

@observer
export class StatPanel extends React.Component<{ character: Character, statId: string, onStatIdChange: (statId: string) => void }, {}> {
  render() {
    const { statId, character } = this.props;
    const stat = getOrCreateStat(character, statId);
    const value = getStatValue(character, stat.id);

    return (<div className={styles.panel}>
      <h1>{value}</h1>
      <TextField fullWidth={true} value={stat.id} onChange={this.onStatIdChange} hintText="Stat Id" />
      <div>
        {stat.modifiers.values().map((modifier, i) =>
          <div key={modifier.id} className={styles.modifierContainer}>
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
    const stat = this.props.character.stats.get(this.props.statId)!;
    stat.modifiers.set(id, { id, description: '', value: '0' });
  };

  @action
  onDeleteModifier = (modifier: Modifier) => {
    const stat = this.props.character.stats.get(this.props.statId)!;
    stat.modifiers.delete(modifier.id);
  };

  @action
  onStatIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.props.onStatIdChange(e.currentTarget.value);
  };
}