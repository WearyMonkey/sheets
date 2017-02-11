import { Component, ComponentClass } from 'react';
import * as Attributes from './attributes/attributes';
import * as Abilities from './abilities/abilities';
import { AttributeAction } from './attributes/attributes';
import { Character } from 'data/character';
import { Action } from 'components/root';
import { Map } from 'immutable';

export type ModuleAction =
    AttributeAction;

export type Module = {
  component: ComponentClass<{ moduleId: number, character: Character, state: any }>,
  reduce: (s: any, a: ModuleAction) => any,
  addToSheet: (c: Character, moduleId: number, s: any) => Array<Action>
}

export const MODULES : Map<string, Module> = Map<string, Module>([
    [Attributes.MODULE_TYPE, { component: Attributes.Attributes, reduce: Attributes.reduce, addToSheet: Attributes.addToSheet }],
    [Abilities.MODULE_TYPE, { component: Abilities.Abilities, reduce: Abilities.reduce, addToSheet: Abilities.addToSheet }],
]);