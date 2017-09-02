import { mapFromJson, mapToJson } from './serialization';
import { Ability, Action, Bonus, Character, Description, DiceRoll, Modifier, Stat, Tag } from './character';
import { TextState } from './text_state';

function tagToJson(tag: Tag) {
  return {
    'id': tag.id
  };
}

function tagFromJson(json: any) {
  return {
    id: json['id']
  };
}

function descriptionToJson(desc: Description): any {
  return {
    'type': desc.type,
    'imageUrl': desc.imageUrl,
    'textState': desc.textState && TextState.toJson(desc.textState)
  };
}

function descriptionFromJson(json: any): Description {
  return {
    type: json['type'],
    imageUrl: json['imageUrl'],
    textState: json['textState'] && TextState.fromJson(json['textState'])
  };
}

function bonusToJson(bonus: Bonus): any {
  const obj: any = {
    'type': bonus.type,
    'description': descriptionToJson(bonus.description)
  };
  if (bonus.type == 'STAT') obj['statId'] = bonus.statId;
  if (bonus.type == 'VALUE') obj['value'] = bonus.value;
  return obj;
}

function bonusFromJson(json: any): Bonus {
  switch (json['type']) {
    case 'VALUE':
      return {
        type: 'VALUE',
        description: descriptionFromJson(json.description),
        value: json['value']
      };
    case 'STAT':
      return {
        type: 'STAT',
        description: descriptionFromJson(json.description),
        statId: json['statId']
      };
    default:
      throw new Error(`Unknown bonus type ${json['type']}`);
  }
}

function diceRollToJson(diceRoll: DiceRoll): any {
  return {
    'dice': diceRoll.dice.map(die => (
        {
          'id': die.id,
          'sides': die.sides,
          'dice': die.dice,
          'bonus': die.bonus && bonusFromJson(die.bonus)
        }
    ))
  };
}

function diceRollFromJson(json: any): DiceRoll {
  return {
    dice: json.dice.map((jsonDie: any) => (
        {
          id: jsonDie['id'],
          sides: jsonDie['sides'],
          dice: jsonDie['dice'],
          bonus: jsonDie['bonus'] && bonusToJson(jsonDie['bonus'])
        }
    ))
  };
}

function actionToJson(action: Action): any {
  const obj: any = {
    'type': action.type,
    'id': action.id,
    'description': descriptionToJson(action.description)
  };
  if (action.type == 'ROLL') obj['diceRoll'] = diceRollToJson(action.diceRoll);
  return obj;
}

function actionFromJson(json: any): Action {
  switch (json['type']) {
    case 'ROLL':
      return {
        type: 'ROLL',
        id: json['id'],
        description: descriptionFromJson(json['description']),
        diceRoll: diceRollFromJson(json['diceRoll'])
      };
    default:
      throw new Error(`Unknown action type ${json['type']}`);
  }
}

function abilityToJson(ability: Ability): any {
  return {
    'id': ability.id,
    'tags': ability.tags.map(tagToJson),
    'description': descriptionToJson(ability.description),
    'actions': ability.actions.map(action => actionToJson(action))
  };
}

function abilityFromJson(json: any): Ability {
  return {
    id: json['id'],
    tags: json['tags'] ? json['tags'].map(tagFromJson) : [],
    description: descriptionFromJson(json['description']),
    actions: json['actions'].map((action: any) => actionFromJson(action))
  };
}

function modifierToJson(modifier: Modifier): any {
  return {
    'id': modifier.id,
    'moduleId': modifier.moduleId,
    'description': modifier.description,
    'value': modifier.value
  };
}

function modifierFromJson(json: any): Modifier {
  return {
    id: json['id'],
    moduleId: json['moduleId'],
    description: json['description'],
    value: json['value']
  };
}

function statToJson(stat: Stat): any {
  return {
    'id': stat.id,
    'modifiers': mapToJson(stat.modifiers, modifierToJson)
  };
}

function statFromJson(json: any): Stat {
  return {
    id: json['id'],
    modifiers: mapFromJson(json['modifiers'], modifierFromJson)
  };
}

export function characterToJson(character: Character): any {
  return {
    'stats': mapToJson(character.stats, statToJson),
    'abilities': character.abilities.map(abilityToJson)
  };
}

export function characterFromJson(json: any): Character {
  return new Character(mapFromJson(json['stats'], statFromJson), json['abilities'].map(abilityFromJson));
}