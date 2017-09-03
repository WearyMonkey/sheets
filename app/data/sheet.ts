import { observable } from 'mobx';

export type ModuleConfig = {
  id: string,
  type: string,
  state: any
}

export class Sheet {
  @observable readonly modules: ModuleConfig[];

  constructor(modules: ModuleConfig[]) {
    this.modules = modules;
  }
}

export function sheetToJson(sheet: Sheet) {
  return { 'modules': sheet.modules };
}

export function sheetFromJson(json: any): Sheet {
  return new Sheet(json['modules']);
}