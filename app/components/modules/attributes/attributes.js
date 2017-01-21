import React, { Component } from 'react';
import styles from './attributes.scss';
import NumberInput from 'material-ui-number-input';
import { List } from 'immutable';
import { bindActionCreators } from 'redux';
import { SET_STAT_MODIFIER, REMOVE_STAT_MODIFIER, Modifier } from '/data/stats';
import { PropTypes } from 'react'

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
const ADD_ATTRIBUTE_ACTION = `ADD_ATTRIBUTE`;
const REMOVE_ATTRIBUTE_ACTION = `REMOVE_ATTRIBUTE`;

export function reduce(state: List<Attribute> = List(), action) {
  switch (action.type) {
    case ADD_ATTRIBUTE_ACTION:
      return state.push(action.attribute);
    case REMOVE_ATTRIBUTE_ACTION:
      return state.delete(state.indexOf(action.attribute));
    default:
      return state;
  }
}

export class Attributes extends Component {
  render() {
    const { state, sheet, moduleId } = this.props;
    const attributes = state;
    const attributeValues = attributes.map(attr => sheet
        .get(attr.statId, List())
        .reduce((sum, modifier) => sum + modifier.value, 0));

    const actionCreators = bindActionCreators({
      onAddAttribute(attribute: Attribute) {
        return {
          type: ADD_ATTRIBUTE_ACTION,
          moduleId,
          attribute: attribute
        }
      },
      onRemoveAttribute(attribute: Attribute) {
        return {
          type: REMOVE_ATTRIBUTE_ACTION,
          moduleId,
          attribute: attribute
        }
      },
      onAttributeChange(attribute: Attribute, value) {
        return {
          type: SET_STAT_MODIFIER,
          moduleId,
          modifier: {
            id: `${moduleId}/${attribute.statId}`,
            statId: attribute.statId,
            source: moduleId,
            value: value,
            description: `Base ${attribute.displayName}`
          }
        }
      }
    }, this.context.dispatch );

    const props = { ...actionCreators, attributes, attributeValues };

    return <AttributesPresentation {...props} />
  }
}

Attributes.contextTypes = {
  dispatch: PropTypes.func.isRequired
};