import * as React from 'react';
import { Character } from 'data/character';
import RaisedButton from 'material-ui/RaisedButton';
import { AbilityCard } from './ability_card';
import { observer } from 'mobx-react';
import { AppState } from 'data/app_state';
import { action } from 'mobx';
import { generateId } from 'data/guid';

type AbilitiesState = {

}

export function addToCharacter(character: Character, moduleId: number, state: AbilitiesState) : void {

}

export const MODULE_TYPE : string = 'ABILITIES_MODULE';

@observer
export class Abilities extends React.Component<{moduleId: number, character: Character, state: AbilitiesState, appState: AppState}, {}> {
  render() {
    const {character, appState} = this.props;
    const abilities = character.abilities;
    return (<div>
      {abilities.map(ability =>
          <AbilityCard key={ability.id} {...{ability, appState}} />
      )}
      <RaisedButton onClick={this.onAdd}>Add</RaisedButton>
    </div>);
  }

  @action
  onAdd = () => {
    this.props.character.abilities.push({ id: generateId(), actions: [], description: { type: 'TEXT' } })
  }
}
