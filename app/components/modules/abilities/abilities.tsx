import * as React from 'react';
import { List } from 'immutable';
import { EditDescription, ViewDescription } from 'components/common/description';
import { Ability, Character, CharacterAction } from 'data/character';
import RaisedButton from 'material-ui/RaisedButton';

type AbilitiesState = {

}

export function addToSheet(character: Character, moduleId: string, state: AbilitiesState) : Array<CharacterAction> {
  return [];
}

export const MODULE_TYPE : string = 'ABILITIES_MODULE';

export function reduce(state: AbilitiesState = { }, action: any) {
  return state;
}

export class Abilities extends React.Component<{ moduleId: number, character: Character, state: AbilitiesState }, {}> {

  context: { dispatch:  (a: CharacterAction ) => CharacterAction };

  render() {
    const { character } = this.props;
    return <AbilitiesPresentation abilities={character.abilities} addMode={false} />;
  }
}

function AbilitiesPresentation({ abilities, addMode } : { abilities: List<Ability>, addMode: boolean }) {
  return <div>
    {abilities.map(ability =>
      <ViewDescription key={ability.id} description={ability.description} />
    )}
    {addMode &&
      <EditDescription onSave={() => {}} description={null} />
    }
    {!addMode &&
      <RaisedButton>Add</RaisedButton>
    }
  </div>
}