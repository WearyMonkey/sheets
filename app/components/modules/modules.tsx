import { ComponentClass } from 'react';
import * as Abilities from './abilities/abilities';
import * as Grid from './grid/grid';
import { Character } from 'data/character';
import { AppState } from 'data/app_state';

type ModuleProps = {
  moduleId: number,
  character: Character,
  state: any,
  appState?: AppState,
  onDelete(moduleId: number): void
}

type Module = {
  Component: ComponentClass<ModuleProps>,
  addToCharacter: (c: Character, moduleId: number, state: any) => void
}

export const MODULES = new Map<string, Module>()
    .set(Grid.MODULE_TYPE, { Component: Grid.GridModule, addToCharacter: Grid.addToCharacter })
    .set(Abilities.MODULE_TYPE, { Component: Abilities.Abilities, addToCharacter: Abilities.addToCharacter });