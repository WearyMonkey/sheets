import * as React from 'react';
import { Ability, Character } from 'data/character';
import RaisedButton from 'material-ui/RaisedButton';
import { AbilityCard } from './ability_card';
import { SheetUiActionCallback } from 'components/sheet/sheet';
import { observer } from 'mobx-react';

type AbilitiesState = {

}

export function addToCharacter(character: Character, moduleId: number, state: AbilitiesState) : void {

}

export const MODULE_TYPE : string = 'ABILITIES_MODULE';

@observer
export class Abilities extends React.Component<{moduleId: number, character: Character, state: AbilitiesState, sheetUiAction: SheetUiActionCallback}, {}> {
  render() {
    const {character, sheetUiAction} = this.props;
    const abilities = character.abilities;
    return (<div>
      {abilities.map(ability =>
          <AbilityCard key={ability.id} {...{ability, sheetUiAction}} />
      )}
      <RaisedButton>Add</RaisedButton>
    </div>);
  }
}
