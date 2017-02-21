// import * as React from 'react';
// import { List } from 'immutable';
// import { Ability, CharacterStore } from 'data/character';
// import RaisedButton from 'material-ui/RaisedButton';
// import { AbilityCard } from './ability_card';
// import { SheetUiActionCallback } from 'components/sheet/sheet';
//
// type AbilitiesState = {
//
// }
//
// export function addToSheet(characterStore: CharacterStore, moduleId: number, state: AbilitiesState) : void {
//
// }
//
// export const MODULE_TYPE : string = 'ABILITIES_MODULE';
//
// export class Abilities extends React.Component<{ moduleId: number, characterStore: CharacterStore, store: Store<AbilitiesState>, sheetUiAction: SheetUiActionCallback }, {}> {
//   render() {
//     const { characterStore, sheetUiAction } = this.props;
//     const abilities = characterStore.get().abilities;
//     const abilityStores = abilities.map((ability, i) => {
//       return characterStore.lens({
//         get: character => character.abilities.get(i),
//         set: (character, ability : Ability) => ({ ...character, abilities: character.abilities.set(i, ability) })
//       })
//     }).toList();
//     return <AbilitiesPresentation {...{abilityStores, sheetUiAction}} />;
//   }
// }
//
// function AbilitiesPresentation({ abilityStores, sheetUiAction } : { abilityStores: List<Store<Ability>>, sheetUiAction: SheetUiActionCallback }) {
//   return <div>
//     {abilityStores.map(abilityStore =>
//       <AbilityCard key={abilityStore.get().id} {...{abilityStore, sheetUiAction}} />
//     )}
//     <RaisedButton>Add</RaisedButton>
//   </div>
// }