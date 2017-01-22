import React from 'react';
import { Attributes, reduce, MODULE_TYPE, addToSheet } from './attributes/attributes';
import type { AttributeAction } from './attributes/attributes';
import type { Character } from '/data/character';
import type { Action } from '/components/root';
import { Map } from 'immutable';

export type ModuleAction =
    | AttributeAction;

export type Module = {
  component: Class<React.Component<*, { moduleId: number, character: Character, state: any }, *>>,
  reduce: (s: *, a: ModuleAction) => *,
  addToSheet: (c: Character, moduleId: number, s: *) => Array<Action>
}

export const MODULES : Map<string, Module> = new Map([
    [MODULE_TYPE, { component: Attributes, reduce, addToSheet }]
]);