import { observable } from 'mobx';
import { Stat, Ability } from './character';

export class AppState {
  @observable selectedStatId?: string|null;
  onStatIdChange: (statId: string) => void;
  @observable selectedAbility?: Ability|null;
}