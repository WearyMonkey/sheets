import { observable } from 'mobx';

export type ModuleConfig = {
  id: number,
  type: string,
  state: any
}

export class Sheet {
  constructor(modules: ModuleConfig[] = []) {
    this.modules = modules;
  }

  @observable readonly modules: ModuleConfig[];
}

export function sheetToJson(sheet: Sheet) {
  return { 'modules': sheet.modules };
}

export function sheetFromJson(json: any): Sheet {
  return new Sheet(json['modules']);
}