//@flow

import React, { Component } from 'react';
import styles from './attributes.scss';
import NumberInput from 'material-ui-number-input';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { SET_STAT_MODIFIER, REMOVE_STAT_MODIFIER, Modifier } from 'data/stats';

export const MODULE_ID = 'ATTRIBUTES';
const ADD_ATTRIBUTE = `${MODULE_ID}/ADD_ATTRIBUTE`;
const REMOVE_ATTRIBUTE = `${MODULE_ID}/REMOVE_ATTRIBUTE`;

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

export const Attributes = connect((state: Map) => {
  const attributes = state.sheet.modules.find(m => m.id == MODULE_ID).state;
  const attributeValues = attributes.map(attr => state.stats
      .get(attr.statId, List())
      .reduce((sum, modifier) => sum + modifier.value, 0));
  return { attributes, attributeValues };
}, {
  onAddAttribute(attribute: Attribute) {
    return {
      type: ADD_ATTRIBUTE,
      attribute: attribute
    }
  },
  onRemoveAttribute(attribute: Attribute) {
    return {
      type: REMOVE_ATTRIBUTE,
      attribute: attribute
    }
  },
  onAttributeChange(attribute: Attribute, value) {
    return {
      type: SET_STAT_MODIFIER,
      modifier: {
        id: `${MODULE_ID}/${attribute.statId}`,
        statId: attribute.statId,
        source: MODULE_ID,
        value: value,
        description: `Base ${attribute.displayName}`
      }
    }
  }
})(AttributesPresentation);

export function reduce(state: List<Attribute> = List(), action) {
  switch (action.type) {
    case ADD_ATTRIBUTE:
      return state.push(action.attribute);
    case REMOVE_ATTRIBUTE:
      return state.delete(state.indexOf(action.attribute));
    default:
      return state;
  }
}
