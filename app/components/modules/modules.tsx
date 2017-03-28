import { ComponentClass } from 'react';
import * as Abilities from './abilities/abilities';
import * as Grid from './grid/grid';
import { Character } from 'data/character';
import { AppState } from 'data/app_state';

type Module = {
  component: ComponentClass<{ moduleId: number, character: Character, state: any, appState?: AppState, onDelete: () => void }>,
  addToCharacter: (c: Character, moduleId: number, state: any) => void
}

export const MODULES = new Map<string, Module>()
    .set(Grid.MODULE_TYPE, { component: Grid.GridModule, addToCharacter: Grid.addToCharacter })
    .set(Abilities.MODULE_TYPE, { component: Abilities.Abilities, addToCharacter: Abilities.addToCharacter });