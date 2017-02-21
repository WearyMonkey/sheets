import * as React from 'react';
import * as styles from './attributes.css';
import NumberInput from 'material-ui-number-input';
import TextField from 'material-ui/TextField';
import { List } from 'immutable';
import { CharacterStore, Character, Modifier } from 'data/character';
import { VerticalTable } from 'components/common/vertical-table';
import { connect, Dispatch } from 'react-redux';
import { Sheet } from '../../sheet/sheet';
import { State } from '../../root';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { createSelector } from 'reselect-map';
import { Store } from '../../../data/lens';
import { memoizer } from '../../../data/memoize';

type Attribute = {
  id: string,
  statId: string,
  displayName: string,
}

type Props = {
  attributeValues: List<{attr: Attribute, baseValue: number, value: number, mod: number, modifier: Modifier}>,
};

type Actions = {
  onAddAttribute: () => void,
  onRemoveAttribute: (i: number) => void,
  onAttributeChange: (a: Attribute, newValue: number) => void,
  onAttributeStatIdChange: (em: Modifier, a: Attribute, i: number, newValue: string) => void
}

export const MODULE_TYPE = 'ATTRIBUTES_MODULE';

export function addToSheet(characterStore: CharacterStore, moduleId: number, state: List<Attribute>) : void {
  // state.forEach(attr => {
  //   const modifier = characterStore.getModifier(attr.statId, `${moduleId}/${attr.statId}`);
  //   if (modifier) {
  //     setAttributeModifier(moduleId, attr.statId, attr, 0)
  //   }
  // });
}

// const mapStateToProps = createSelector(
//     ({state, lens} : {state: State, lens: Store<List<Attribute>>, moduleId: number}) => lens.get(state),
//     ({state}) => state.character,
//     ({moduleId}) => moduleId,
//     (attributes, character, moduleId) => {
//       const attributeValues = attributes.map(attr => {
//         const modifier = CharacterStore.getModifier(character, attr.statId, `${moduleId}/${attr.statId}`);
//         return {
//           attr,
//           baseValue: modifier && typeof modifier.value == 'number' ? modifier.value : 0,
//           value: CharacterStore.getStatValue(character, attr.statId),
//           mod: CharacterStore.getStatValue(character, `${attr.statId}-mod`),
//           modifier: CharacterStore.getModifier(character, attr.statId, `${moduleId}/${attr.statId}`)
//         };
//       }).toList();
//       return { attributeValues };
//     }
// );

const mapStateToProps = createSelector(
    ({state, lens} : {state: State, lens: Store<List<Attribute>>, moduleId: number}) => lens.get(state),
    ({state}) => state.character,
    ({moduleId}) => moduleId,
    (attributes, character, moduleId) => {
      const attributeValues = attributes.map(attr => {
        const modifier = CharacterStore.getModifier(character, attr.statId, `${moduleId}/${attr.statId}`);
        return {
          attr,
          baseValue: modifier && typeof modifier.value == 'number' ? modifier.value : 0,
          value: CharacterStore.getStatValue(character, attr.statId),
          mod: CharacterStore.getStatValue(character, `${attr.statId}-mod`),
          modifier
        };
      }).toList();
      return { attributeValues };
    }
);

memoizer(({state, lens} : {state: State, lens: Store<List<Attribute>>, moduleId: number}, chain) =>
  [lens.get(attributes)])
    .map('attributes', (attribute : Attribute) => null);

foo(({state, lens} : {state: State, lens: Store<List<Attribute>>, moduleId: number}) => lens.get(state))
    .baa(({ attribute, character }) => ({
      attr: attribute,
      modifier: CharacterStore.getModifier(character, attr.statId, `${moduleId}/${attr.statId}`),
      value: CharacterStore.getModifier(character, attr.statId, `${moduleId}/${attr.statId}`),
      mod: CharacterStore.getStatValue(character, `${attr.statId}-mod`),
    }));


export const Attributes = connect((state: State, { moduleId , lens } : { moduleId: number, lens: Store<List<Attribute>> }) => mapStateToProps({ state, moduleId, lens }), dispatchToProps)(AttributesPresentation);

function dispatchToProps(dispatch : Dispatch<State>, { moduleId } : {moduleId : number}): Actions {
  return bindActionCreators({
    onAddAttribute() {
      return {type: 'ADD_ATTRIBUTE', isUpdate: true, update: (state: State) : State => {
        const i = state.sheet.modules.findIndex(mc => mc.id == moduleId);
        const mc = state.sheet.modules.get(i);
        const attributes : List<Attribute> = mc.state;
        return {...state, sheet: {...state.sheet, modules: state.sheet.modules.set(i, { ...mc, state: attributes.push({ id: Math.random().toString(), statId: '', displayName: '' }) }) }};
      }};
    },
    onRemoveAttribute(index: number) {
      return {type: 'REMOVE_ATTRIBUTE', isUpdate: true, update: (state: State) : State => {
        const i = state.sheet.modules.findIndex(mc => mc.id == moduleId);
        const mc = state.sheet.modules.get(i);
        const attributes : List<Attribute> = mc.state;
        return {...state, sheet: {...state.sheet, modules: state.sheet.modules.set(i, { ...mc, state: attributes.delete(index) }) }};
      }};
    },
    onAttributeChange(attribute: Attribute, value: number) {
      return {type: 'BATCH', actions: setAttributeModifier(moduleId, attribute.statId, attribute, value) };
    },
    onAttributeStatIdChange(existingModifier: Modifier, attr: Attribute, index: number, newStatId: string) {
      return {type: 'BATCH', actions: [
        ...existingModifier ? [
              CharacterStore.removeStatModifier(attr.statId, `${moduleId}/${attr.statId}`),
              CharacterStore.removeStatModifier(`${attr.statId}-mod`, `${moduleId}/${attr.statId}-mod`) ] : [],
        ...setAttributeModifier(moduleId, newStatId, attr, existingModifier ? existingModifier.value : 0),
        {type: 'REMOVE_ATTRIBUTE', isUpdate: true, update: (state: State) : State => {
          const i = state.sheet.modules.findIndex(mc => mc.id == moduleId);
          const mc = state.sheet.modules.get(i);
          const attributes : List<Attribute> = mc.state;
          return {...state, sheet: {...state.sheet, modules: state.sheet.modules.set(i, { ...mc, state: attributes.set(index, { ...attributes.get(index), statId: newStatId }) }) }};
        }}
      ]};
    }
  }, dispatch);
}

function AttributesPresentation({onAddAttribute, onRemoveAttribute, onAttributeChange, onAttributeStatIdChange, attributeValues } : Props & Actions) {
  return <VerticalTable
      editMode={true}
      cols={[
          {displayName: 'Attribute'},
          {displayName: 'Stat Id'},
          {displayName: 'Base'},
          {displayName: 'Value'},
          {displayName: 'Mod'},
      ]}
      rows={attributeValues.map(({attr, baseValue, value, mod, modifier}, i) => ({
        elements: [
            {view: <span>{attr.displayName}</span> },
            {view: <TextField id={`stat_id_${attr.id}`} defaultValue={attr.statId} onChange={(e : React.FormEvent<HTMLInputElement>) => onAttributeStatIdChange(modifier, attr, i, e.currentTarget.value)} /> },
            {view: <NumberInput id={`value_${attr.id}`} name={attr.statId} defaultValue={baseValue} onValid={newValue => onAttributeChange(attr, newValue)}/> },
            {view: <span>{value}</span> },
            {view: <span>{mod}</span> },
        ],
        onDelete: () => onRemoveAttribute(i)
      })).toArray()}
      onAdd={onAddAttribute}
  />
}


function setAttributeModifier(moduleId: number, statId: string, attr: Attribute, value: any) : Array<any> {
  return [
    CharacterStore.setStatModifier({
      id: `${moduleId}/${statId}`,
      description: `Base ${attr.displayName}`,
      value, statId, moduleId,
    }),
    CharacterStore.setStatModifier({
      id: `${moduleId}/${statId}-mod`,
      statId: `${statId}-mod`,
      moduleId,
      value: {statId, factor: 0.5, round: 'DOWN'},
      description: `Base ${attr.displayName} mod`
    })
  ];
}