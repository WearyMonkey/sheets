import { Map, List } from 'immutable';
import { Store, Lens } from "./store";

export type Description =
    { type: 'IMAGE', url: string }
    | { type: 'TEXT',  value: string };

export type Bonus =
    { type: 'STAT', description: Description, statId: string  }
    | { type: 'VALUE', description: Description, value: number };

export type DiceRoll = {
  dice: List<{ sides: number, dice: number, bonus?: Bonus }>
};

export type Action =
    { type: 'ROLL', id: string, diceRoll: DiceRoll, description: Description };

export type Ability = {
  id: string,
  description: Description,
  actions: List<Action>
};

export type Modifier = {
  id: string,
  statId: string,
  moduleId: number,
  description: string,
  value: number | { statId: string, factor: number, round: 'DOWN' | 'UP' | number }
};

export type Character = {
  stats: Map<string, Map<string, Modifier>>,
  abilities: List<Ability>
};

export class CharacterStore {
  private store: Store<Character>;

  constructor(store: Store<Character>) {
    this.store = store;
  }

  get() : Character {
    return this.store.get();
  }

  lens<ChildValue>(lens: Lens<Character, ChildValue>) : Store<ChildValue> {
    return this.store.lens(lens);
  }

  getStatValue(statId: string) : number {
    const character = this.store.get();
    const modifiers = character.stats.get(statId) || Map<string, Modifier>();
    return modifiers.reduce((total, modifier) => {
      let value = modifier.value;
      if (typeof value == 'number') {
        return total + value;
      } else {
        return total + round(this.getStatValue(value.statId) * value.factor, value.round);
      }
    }, 0);
  }

  getModifier(statId: string, id: string) : Modifier|null {
    const character = this.store.get();
    return character.stats.getIn([statId, id]);
  }

  setStatModifier(modifier: Modifier) : void {
    this.store.update('SET_STAT_MODIFIER', character => ({ ...character, stats: character.stats.setIn([modifier.statId, modifier.id], modifier) }))
  }

  removeStatModifier(statId: string, modifierId: string) : void {
    this.store.update('REMOVE_STAT_MODIFIER', character => {
      let stats = character.stats;
      let stat = stats.get(statId);
      if (stat) {
        stat = stat.delete(modifierId);
      }
      if (stat && stat.size == 0) {
        stats = stats.delete(statId);
      }
      return { ...character, stats };
    });
  }

  addAbility(ability: Ability) : void {
    this.store.update('ADD_ABILITY', character => ({ ...character, abilities: character.abilities.push(ability) }));
  }

  removeAbility(abilityId: string) : void {
    this.store.update('REMOVE_ABILITY', character => ({ ...character, abilities: character.abilities.filter(a => a.id != abilityId).toList() }));
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