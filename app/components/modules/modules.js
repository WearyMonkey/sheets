import React from 'react';
import { Attributes, reduce, MODULE_TYPE } from './attributes/attributes';
import type { AttributeAction } from './attributes/attributes';
import type { Character } from '/data/character';


export type ModuleAction =
    | AttributeAction;


export type Module = {
  component: Class<React.Component<*, { moduleId: string, character: Character, state: * }, *>>,
  reduce: (s: *, a: ModuleAction) => *
}

export const MODULES : Map<string, Module> = new Map([
    [MODULE_TYPE, { component: Attributes, reduce }]
]);