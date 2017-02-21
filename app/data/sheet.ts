import { observable } from 'mobx';

export type ModuleConfig = {
  id: number,
  type: string,
  state: any
}

export class Sheet {
  @observable modules: ModuleConfig[] = [];
}