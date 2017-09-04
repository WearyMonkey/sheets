import * as React from 'react';
import { Character, Tag } from 'data/character';
import RaisedButton from 'material-ui/RaisedButton';
import { AbilityCard } from './ability_card';
import { observer } from 'mobx-react';
import { AppState } from 'data/app_state';
import { action } from 'mobx';
import { generateId } from 'data/guid';
import { ModuleHeader } from 'components/module_header/module_header';
import TextField from 'material-ui/TextField';
import { Sheet } from "../../../data/sheet";
import * as styles from './abilities.css';

type AbilitiesState = {
  title: string,
  filter?: string
}

export function addToCharacter(character: Character, moduleId: string, state: AbilitiesState): void {

}

export const MODULE_TYPE: string = 'ABILITIES_MODULE';

type Props = {
  moduleId: string,
  character: Character,
  sheet: Sheet,
  state: AbilitiesState,
  appState: AppState,
  onDelete(): void,
};

@observer
export class Abilities extends React.Component<Props> {
  render() {
    const { moduleId, character, sheet, appState, state, onDelete } = this.props;
    const { title, filter } = state;
    const abilities = filter
        ? character.abilities.filter(a => a.tags.find(t => t.id == filter))
        : character.abilities;

    return (
        <div>
          <ModuleHeader
              {...{ moduleId, title, sheet }}
              menuItems={[]}
              onTitleChange={this.onTitleChange}/>
          <TextField
              className={styles.tags}
              name={`${moduleId}_filter`}
              value={filter ? filter : ''}
              onChange={this.onFilterChange}
              hintText="tag"/>
          {abilities.map(ability =>
              <AbilityCard key={ability.id} {...{ ability, appState }} />
          )}
          <RaisedButton onClick={this.onAdd}>Add</RaisedButton>
        </div>
    );
  }

  @action
  private readonly onTitleChange = (title: string) => {
    this.props.state.title = title;
  };

  @action
  private readonly onAdd = () => {
    const tags: Tag[] = this.props.state.filter
        ? [{ id: this.props.state.filter }]
        : [];
    this.props.character.abilities.push({
      id: generateId(),
      actions: [],
      modifiers: [],
      description: { type: 'TEXT' },
      tags
    })
  };

  @action
  private readonly onFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const value = e.currentTarget.value;
    this.props.state.filter = value;
  };
}
