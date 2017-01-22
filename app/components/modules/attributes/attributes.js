import React, { Component } from 'react';
import styles from './attributes.scss';
import NumberInput from 'material-ui-number-input';
import { List } from 'immutable';
import { bindActionCreators } from 'redux';
import { setStatModifier, removeStatModifier } from '/data/character';
import type { Modifier, CharacterAction } from '/data/character';
import { PropTypes } from 'react'
import type { Character } from '/data/character';
import { getStatValue } from '/data/character';
import { makeBatch } from '/data/batch';
import type { BatchAction } from '/data/batch';

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
  context: { dispatch:  (a: BatchAction | CharacterAction | AttributeAction ) => BatchAction | CharacterAction | AttributeAction };

  componentWillMount() {
    const moduleId = this.props.moduleId;
    this.props.state.forEach(attr => {
      this.context.dispatch(setStatModifier({
        id: `${moduleId}/${attr.statId}`,
        statId: `${attr.statId}-mod`,
        sourceId: moduleId,
        value: { statId: attr.statId, factor: 1, round: 'DOWN' },
        description: `${attr.displayName} Mod`
      }));
    });
  }

  render() {
    const { state, character, moduleId } = this.props;
    const attributes = state;
    const attributeValues = attributes.map(attr => getStatValue(character, attr.statId));

    const actionCreators = bindActionCreators({
      onAddAttribute(attribute: Attribute) : AttributeAction {
        return { type: "ADD_ATTRIBUTE", moduleId, attribute };
      },
      onRemoveAttribute(attribute: Attribute) : AttributeAction {
        return { type: "REMOVE_ATTRIBUTE", moduleId, attribute };
      },
      onAttributeChange(attribute: Attribute, value) : CharacterAction {
        return setStatModifier({
          id: `${moduleId}/${attribute.statId}`,
          statId: attribute.statId,
          sourceId: moduleId,
          value: value,
          description: `Base ${attribute.displayName}`
        })
      }
    }, this.context.dispatch );

    const props = { ...actionCreators, attributes, attributeValues };

    return <AttributesPresentation {...props} />
  }
}

Attributes.contextTypes = {
  dispatch: PropTypes.func.isRequired
};