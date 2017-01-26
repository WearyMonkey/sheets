// @flow
import React from 'react';
import * as Attributes from './attributes/attributes';
import * as Abilities from './abilities/abilities';
import type { AttributeAction } from './attributes/attributes';
import type { Character } from 'data/character';
import type { Action } from 'components/root';
import { Map } from 'immutable';

export type ModuleAction =
    | AttributeAction;

export type Module = {
  component: Class<React.Component<*, { moduleId: number, character: Character, state: any }, *>>,
  reduce: (s: *, a: ModuleAction) => *,
  addToSheet: (c: Character, moduleId: number, s: *) => Array<Action>
}

export const MODULES : Map<string, Module> = new Map([
    [Attributes.MODULE_TYPE, { component: Attributes.Attributes, reduce: Attributes.reduce, addToSheet: Attributes.addToSheet }],
    [Abilities.MODULE_TYPE, { component: Abilities.Abilities, reduce: Abilities.reduce, addToSheet: Abilities.addToSheet }],
]);