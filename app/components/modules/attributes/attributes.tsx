import * as React from 'react';
import * as styles from './attributes.css';
import NumberInput from 'material-ui-number-input';
import TextField from 'material-ui/TextField';
import { List } from 'immutable';
import { bindActionCreators } from 'redux';
import { setStatModifier, removeStatModifier } from 'data/character';
import { CharacterAction } from 'data/character';
import { PropTypes } from 'react'
import { Character } from 'data/character';
import { getStatValue, getModifier } from 'data/character';
import { makeBatch } from 'data/batch';
import { BatchAction } from 'data/batch';
import { VerticalTable } from 'components/common/vertical-table';
import { Action } from 'components/root';

type Attribute = {
  statId: string,
  displayName: string,
}

export type AttributeAction =
    { type: 'ADD_ATTRIBUTE', moduleId: number }
    | { type: 'REMOVE_ATTRIBUTE', moduleId: number, index: number }
    | { type: 'CHANGE_ATTRIBUTE_STAT_ID', moduleId: number, index: number, newStatId: string }


export const MODULE_TYPE = 'ATTRIBUTES_MODULE';
export function reduce(state: List<Attribute> = List<Attribute>(), action : AttributeAction) {
  switch (action.type) {
    case 'ADD_ATTRIBUTE':
      return state.push({ statId: '', displayName: '' });
    case 'REMOVE_ATTRIBUTE':
      return state.delete(action.index);
    case 'CHANGE_ATTRIBUTE_STAT_ID':
      return state.set(action.index, { ...state.get(action.index), statId: action.newStatId });
    default:
      return state;
  }
}

export function addToSheet(character: Character, moduleId: number, state: List<Attribute>) : Array<Action> {
  return state.reduce((actions, attr) => {
    const modifier = getModifier(character, attr.statId, `${moduleId}/${attr.statId}`);
    return modifier
        ? actions.concat([setAttributeModifier(moduleId, attr.statId, attr, 0)])
        : actions;
  }, []);
}

export class Attributes extends React.Component<{ moduleId: number, character: Character, state: List<Attribute> }, {}> {

  context: { dispatch:  (a: BatchAction | CharacterAction | AttributeAction ) => BatchAction | CharacterAction | AttributeAction };

  render() {
    const { state, character, moduleId } = this.props;
    const attributeValues = state.map(attr => {
      const modifier = getModifier(character, attr.statId, `${moduleId}/${attr.statId}`);
      return {
        attr,
        baseValue: modifier && typeof modifier.value == 'number' ? modifier.value : 0,
        value: getStatValue(character, attr.statId),
        mod: getStatValue(character, `${attr.statId}-mod`)
      };
    }).toList();
    const actionCreators = bindActionCreators({
      onAddAttribute() : AttributeAction {
        return { type: 'ADD_ATTRIBUTE', moduleId };
      },
      onRemoveAttribute(index: number) : AttributeAction {
        return { type: 'REMOVE_ATTRIBUTE', moduleId, index };
      },
      onAttributeChange(attribute: Attribute, value: number) : BatchAction {
        return setAttributeModifier(moduleId, attribute.statId, attribute, value);
      },
      onAttributeStatIdChange(attr: Attribute, index: number, newStatId: string) : BatchAction {
        const modifier = getModifier(character, attr.statId, `${moduleId}/${attr.statId}`);
        return makeBatch([
            ...modifier ? [
              removeStatModifier(attr.statId, `${moduleId}/${attr.statId}`),
              removeStatModifier(`${attr.statId}-mod`, `${moduleId}/${attr.statId}-mod`),
            ] : [],
          setAttributeModifier(moduleId, newStatId, attr, modifier ? modifier.value : 0),
          { type: 'CHANGE_ATTRIBUTE_STAT_ID', moduleId, index, newStatId }
        ]);
      }
    }, this.context.dispatch );

    return <AttributesPresentation {...actionCreators} attributeValues={attributeValues} />;
  }

  static contextTypes = {
    dispatch: PropTypes.func.isRequired
  };
}

function setAttributeModifier(moduleId: number, statId: string, attr: Attribute, value: any) : BatchAction {
  return makeBatch([
      setStatModifier({
        id: `${moduleId}/${statId}`,
        description: `Base ${attr.displayName}`,
        value, statId, moduleId,
      }),
      setStatModifier({
        id: `${moduleId}/${statId}-mod`,
        statId: `${statId}-mod`,
        moduleId,
        value: { statId, factor: 0.5, round: 'DOWN' },
        description: `Base ${attr.displayName} mod`
      })
  ]);
}

function AttributesPresentation({onAddAttribute, onRemoveAttribute, onAttributeChange, onAttributeStatIdChange, attributeValues }
  : {
    onAddAttribute: () => void,
    onRemoveAttribute: (i: number) => void,
    onAttributeChange: (a: Attribute, newValue: number) => void,
    onAttributeStatIdChange: (a: Attribute, i: number, newValue: string) => void,
    attributeValues: List<{attr: Attribute, baseValue: number, value: number, mod: number}>
  }) {
  return <VerticalTable
      editMode={true}
      cols={[
          {displayName: 'Attribute'},
          {displayName: 'Stat Id'},
          {displayName: 'Base'},
          {displayName: 'Value'},
          {displayName: 'Mod'},
      ]}
      rows={attributeValues.map(({attr, baseValue, value, mod}, i) => ({
        elements: [
            {view: <span>{attr.displayName}</span> },
            {view: <TextField defaultValue={attr.statId} onChange={(e : React.FormEvent<HTMLInputElement>) => onAttributeStatIdChange(attr, i, e.currentTarget.value)} /> },
            {view: <NumberInput name={attr.statId} defaultValue={baseValue} onValid={newValue => onAttributeChange(attr, newValue)}/> },
            {view: <span>{value}</span> },
            {view: <span>{mod}</span> },
        ],
        onDelete: () => onRemoveAttribute(i)
      })).toArray()}
      onAdd={onAddAttribute}
  />
}