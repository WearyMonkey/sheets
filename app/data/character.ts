import { observable, asMap, ObservableMap } from 'mobx';

export type Description =
    { type: 'IMAGE', url: string }
    | { type: 'TEXT',  value: string };

export type Bonus =
    { type: 'STAT', description: Description, statId: string  }
    | { type: 'VALUE', description: Description, value: number };

export type DiceRoll = {
  dice: { sides: number, dice: number, bonus?: Bonus }[]
};

export type Action =
    { type: 'ROLL', id: string, diceRoll: DiceRoll, description: Description };

export type Ability = {
  id: string,
  description: Description,
  actions: Action[]
};

export type Modifier = {
  id: string,
  statId: string,
  moduleId: number,
  description: string,
  value: number | { statId: string, factor: number, round: 'DOWN' | 'UP' | number }
};

export class Character {
  @observable readonly stats: ObservableMap<ObservableMap<Modifier>> = observable.map([]);
  @observable readonly abilities: Ability[] = [];

  getStatValue(statId: string) : number {
    const modifiers = this.stats.get(statId) || new Map<string, Modifier>();
    return Array.from(modifiers.values()).reduce((total, modifier) => {
      let value = modifier.value;
      if (typeof value == 'number') {
        return total + value;
      } else {
        return total + round(this.getStatValue(value.statId) * value.factor, value.round);
      }
    }, 0);
  }

  getModifier(statId: string, id: string) : Modifier|null {
    const modifiers = this.stats.get(statId);
    return modifiers && modifiers.get(id);
  }

  setStatModifier(modifier: Modifier) : void {
    if (!this.stats.has(modifier.statId)) {
      this.stats.set(modifier.statId, observable.map([]));
    }
    this.stats.get(modifier.statId).set(modifier.id, modifier);
  }

  removeStatModifier(statId: string, modifierId: string) : void {
    let stat = this.stats.get(statId);
    if (stat) {
      stat.delete(modifierId);
    }
    if (stat && stat.size == 0) {
      this.stats.delete(statId);
    }
  }

  addAbility(ability: Ability) : void {
    this.abilities.push(ability);
  }

  removeAbility(abilityId: string) : void {
    this.abilities.splice(this.abilities.findIndex(a => a.id == abilityId), 1);
  }
}

function round(value: number, round: 'DOWN' | 'UP' | number) : number {
  if (typeof round === 'string') {
      const softRound = Math.round(value);
      if (Math.abs(softRound - value) < 0.0005) {
        return softRound;
      } else if (round == 'DOWN') {
        return Math.floor(value);
      } else {
        return Math.ceil(value);
      }
  } else {
    return Number(value.toFixed(value));
  }
}