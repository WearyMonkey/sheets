import * as React from 'react';
import { observer } from 'mobx-react';
import { Character, getOrCreateStat, getStatValue, Modifier } from 'data/character';
import TextField from 'material-ui/TextField';
import { ModifierCard } from 'components/modifier_card/modifier_card';
import { action } from 'mobx';
import * as styles from './stat_panel.css';
import FlatButton from 'material-ui/FlatButton';
import { generateId } from 'data/guid';
import ChangeEvent = React.ChangeEvent;

type Props = {
  character: Character,
  statId: string,
  onStatIdChange(statId: string): void,
};

@observer
export class StatPanel extends React.Component<Props> {
  render() {
    const { statId, character } = this.props;
    const stat = getOrCreateStat(character, statId);
    const value = getStatValue(character, stat.id);

    return (
        <div className={styles.panel}>
          <h1>{value}</h1>
          <TextField name={`${statId}_id`}
                     fullWidth={true}
                     value={stat.id}
                     onChange={this.onStatIdChange}
                     hintText="Stat Id"/>
          <div>
            {stat.modifiers.values().map((modifier, i) =>
                <div key={modifier.id} className={styles.modifierContainer}>
                  <ModifierCard character={character}
                                modifier={modifier}
                                onDelete={() => this.onDeleteModifier(modifier)}/>
                </div>
            )}
          </div>
          <FlatButton onClick={this.onAddModifier}>Add Modifier</FlatButton>
        </div>
    );
  }

  @action
  private readonly onAddModifier = () => {
    const id = generateId();
    const stat = this.props.character.stats.get(this.props.statId)!;
    stat.modifiers.set(id, { id, description: '', value: '0' });
  };

  @action
  private readonly onDeleteModifier = (modifier: Modifier) => {
    const stat = this.props.character.stats.get(this.props.statId)!;
    stat.modifiers.delete(modifier.id);
  };

  @action
  private readonly onStatIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.props.onStatIdChange(e.currentTarget.value);
  };
}