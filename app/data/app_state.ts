import { observable } from 'mobx';
import { Stat, Ability } from './character';

export class AppState {
  @observable selectedStat?: Stat|null;
  @observable selectedAbility?: Ability|null;
}