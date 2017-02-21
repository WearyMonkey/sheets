import { ComponentClass } from 'react';
import * as Attributes from './attributes/attributes';
// import * as Abilities from './abilities/abilities';
import { CharacterStore } from 'data/character';
import { Map } from 'immutable';
import { SheetUiActionCallback } from 'components/sheet/sheet';

type Module = {
  component: ComponentClass<{ moduleId: number, sheetUiAction?: SheetUiActionCallback }>,
  addToSheet: (c: CharacterStore, moduleId: number, state: any) => void
}

export const MODULES = Map<string, Module>().withMutations(map => map
    .set(Attributes.MODULE_TYPE, { component: Attributes.Attributes, addToSheet: Attributes.addToSheet })
    // .set(Abilities.MODULE_TYPE, { component: Abilities.Abilities, addToSheet: Abilities.addToSheet })
);