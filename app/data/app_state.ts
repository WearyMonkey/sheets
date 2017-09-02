import { observable } from 'mobx';
import { Ability } from './character';

export class AppState {
  @observable selectedStatId?: string;
  onStatIdChange: (statId: string) => void;
  @observable selectedAbility?: Ability;
}