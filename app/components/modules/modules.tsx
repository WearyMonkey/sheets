import { ComponentClass } from 'react';
import * as Attributes from './attributes/attributes';
import * as Abilities from './abilities/abilities';
import { Character } from 'data/character';
import { Action } from 'components/root';
import { Map } from 'immutable';
import { Store } from "../../data/store";

export type Module = {
  component: ComponentClass<{ moduleId: number, character: Character, store: Store<any> }>,
  addToSheet: (c: Character, moduleId: number, s: any) => Array<Action>
}

export const MODULES : Map<string, Module> = Map<string, Module>([
    [Attributes.MODULE_TYPE, { component: Attributes.Attributes, addToSheet: Attributes.addToSheet }],
    // [Abilities.MODULE_TYPE, { component: Abilities.Abilities, reduce: Abilities.reduce, addToSheet: Abilities.addToSheet }],
]);