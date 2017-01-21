import React, { Component } from 'react';
import styles from './attributes.scss';
import NumberInput from 'material-ui-number-input';
import { List } from 'immutable';
import { bindActionCreators } from 'redux';
import { addStatModifier, removeStatModifier } from '/data/character';
import type { Modifier, CharacterAction } from '/data/character';
import { PropTypes } from 'react'
import type { Character } from '/data/character';

type Attribute = {
  statId: string,
  displayName: string
}

function AttributesPresentation({ onAddAttribute, onRemoveAttribute, onAttributeChange, attributes, attributeValues }) {
  return <div>
    {attributes.map((attribute, i)=> {
      return <div key={i}>
        <span>{attribute.displayName}</span>
        <NumberInput name="{attribute.statId}" onValid={value => onAttributeChange(attribute, value)}/>
        <span>{attributeValues[i]}</span>
      </div>
    })}
  </div>
}

export const MODULE_TYPE = 'ATTRIBUTES_MODULE';
export function reduce(state: List<Attribute> = List(), action : AttributeAction) {
  switch (action.type) {
    case "ADD_ATTRIBUTE":
      return state.push(action.attribute);
    case "REMOVE_ATTRIBUTE":
      return state.delete(state.indexOf(action.attribute));
    default:
      return state;
  }
}

export type AttributeAction =
    | { type: "ADD_ATTRIBUTE", moduleId: number, attribute: Attribute }
    | { type: "REMOVE_ATTRIBUTE", moduleId: number, attribute: Attribute };


export class Attributes extends Component {

  props: { moduleId: number, character: Character, state: List<Attribute> };

  render() {
    const { state, character, moduleId } = this.props;
    const attributes = state;
    const attributeValues = attributes.map(attr => character.stats
        .get(attr.statId, List())
        .reduce((sum, modifier) => sum + modifier.value, 0));

    const actionCreators = bindActionCreators({
      onAddAttribute(attribute: Attribute) : AttributeAction {
        return {
          type: "ADD_ATTRIBUTE",
          moduleId,
          attribute: attribute
        }
      },
      onRemoveAttribute(attribute: Attribute) : AttributeAction {
        return {
          type: "REMOVE_ATTRIBUTE",
          moduleId,
          attribute: attribute
        }
      },
      onAttributeChange(attribute: Attribute, value) : CharacterAction {
        return addStatModifier({
          id: `${moduleId}/${attribute.statId}`,
          statId: attribute.statId,
          sourceId: moduleId,
          value: value,
          description: `Base ${attribute.displayName}`
        });
      }
    }, this.context.dispatch );

    const props = { ...actionCreators, attributes, attributeValues };

    return <AttributesPresentation {...props} />
  }
}

Attributes.contextTypes = {
  dispatch: PropTypes.func.isRequired
};