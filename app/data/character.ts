import { Map, List } from 'immutable';
import { Dispatch } from 'react-redux';
import { State } from '../components/root';

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
  static getStatValue(character: Character, statId: string) : number {
    const modifiers = character.stats.get(statId) || Map<string, Modifier>();
    return modifiers.reduce((total, modifier) => {
      let value = modifier.value;
      if (typeof value == 'number') {
        return total + value;
      } else {
        return total + round(this.getStatValue(character, value.statId) * value.factor, value.round);
      }
    }, 0);
  }

  static getModifier(character: Character, statId: string, id: string) : Modifier|null {
    return character.stats.getIn([statId, id]);
  }

  static setStatModifier(modifier: Modifier) : any {
    return {type: 'SET_STAT_MODIFIER', isUpdate: true, update: (state: State) : State => ({...state, character: {...state.character, stats: state.character.stats.setIn([modifier.statId, modifier.id], modifier)} })};
  }

  static removeStatModifier(statId: string, modifierId: string) : any {
    return {type: 'SET_STAT_MODIFIER', isUpdate: true, update: (state: State) : State => {
      let stats = state.character.stats;
      let stat = stats.get(statId);
      if (stat) {
        stat = stat.delete(modifierId);
      }
      if (stat && stat.size == 0) {
        stats = stats.delete(statId);
      }
      return {...state, character: {...state.character, stats } };
    }}
  }

  static addAbility(ability: Ability) : any {
    return {type: 'SET_STAT_MODIFIER', isUpdate: true, update: (state: State) : State => ({...state, character: {...state.character, abilities: state.character.abilities.push(ability)} })};
  }

  static removeAbility(abilityId: string) : any {
    return {type: 'SET_STAT_MODIFIER', isUpdate: true, update: (state: State) : State => ({...state, character: {...state.character, abilities: state.character.abilities.filter(a => a.id != abilityId).toList()} })};
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