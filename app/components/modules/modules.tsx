import { ComponentClass } from 'react';
import * as Attributes from './attributes/attributes';
import * as Abilities from './abilities/abilities';
import { SheetUiActionCallback } from '../sheet/sheet';
import { Character } from 'data/character';

type Module = {
  component: ComponentClass<{ moduleId: number, character: Character, state: any, sheetUiAction?: SheetUiActionCallback }>,
  addToCharacter: (c: Character, moduleId: number, state: any) => void
}

export const MODULES = new Map<string, Module>()
    .set(Attributes.MODULE_TYPE, { component: Attributes.Attributes, addToCharacter: Attributes.addToCharacter })
    .set(Abilities.MODULE_TYPE, { component: Abilities.Abilities, addToCharacter: Abilities.addToCharacter });