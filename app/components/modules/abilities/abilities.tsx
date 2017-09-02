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

type AbilitiesState = {
  title: string,
  filter?: string|null
}

export function addToCharacter(character: Character, moduleId: number, state: AbilitiesState) : void {

}

export const MODULE_TYPE : string = 'ABILITIES_MODULE';

@observer
export class Abilities extends React.Component<{moduleId: number, character: Character, state: AbilitiesState, appState: AppState, onDelete: () => void}, {}> {
  render() {
    const { moduleId, character, appState, state, onDelete } = this.props;
    const { title, filter } = state;
    const abilities = filter
        ? character.abilities.filter(a => a.tags.find(t => t.id == filter))
        : character.abilities;

    return (<div>
      <ModuleHeader {...{moduleId, title, onDelete}} menuItems={[]} onTitleChange={this.onTitleChange} />
      <TextField name={`${moduleId}_filter`} value={filter ? filter : ''} onChange={this.onFilterChange} hintText="filter" />
      {abilities.map(ability =>
          <AbilityCard key={ability.id} {...{ability, appState}} />
      )}
      <RaisedButton onClick={this.onAdd}>Add</RaisedButton>
    </div>);
  }

  @action
  onTitleChange = (title: string) => {
    this.props.state.title = title;
  };

  @action
  onAdd = () => {
    const tags: Tag[] = this.props.state.filter ? [{id: this.props.state.filter}] : [];
    this.props.character.abilities.push({ id: generateId(), actions: [], description: { type: 'TEXT' }, tags })
  };

  @action
  onFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const value = e.currentTarget.value;
    this.props.state.filter = value ? value : null;
  };
}
