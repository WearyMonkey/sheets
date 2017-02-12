import { ComponentClass } from 'react';
import * as Attributes from './attributes/attributes';
import * as Abilities from './abilities/abilities';
import { CharacterStore } from 'data/character';
import { Map } from 'immutable';
import { Store } from "../../data/store";

export type Module = {
  component: ComponentClass<{ moduleId: number, characterStore: CharacterStore, store: Store<any> }>,
  addToSheet: (c: CharacterStore, moduleId: number, s: any) => void
}

export const MODULES : Map<string, Module> = Map<string, Module>([
    [Attributes.MODULE_TYPE, { component: Attributes.Attributes, addToSheet: Attributes.addToSheet }],
    // [Abilities.MODULE_TYPE, { component: Abilities.Abilities, reduce: Abilities.reduce, addToSheet: Abilities.addToSheet }],
]);