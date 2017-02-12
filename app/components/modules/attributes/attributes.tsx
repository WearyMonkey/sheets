import * as React from 'react';
import * as styles from './attributes.css';
import NumberInput from 'material-ui-number-input';
import TextField from 'material-ui/TextField';
import { List } from 'immutable';
import { CharacterStore } from 'data/character';
import { VerticalTable } from 'components/common/vertical-table';
import { Store } from 'data/store';

type Attribute = {
  id: string,
  statId: string,
  displayName: string,
}

export const MODULE_TYPE = 'ATTRIBUTES_MODULE';

export function addToSheet(characterStore: CharacterStore, moduleId: number, state: List<Attribute>) : void {
  state.forEach(attr => {
    const modifier = characterStore.getModifier(attr.statId, `${moduleId}/${attr.statId}`);
    if (modifier) {
      setAttributeModifier(characterStore, moduleId, attr.statId, attr, 0)
    }
  });
}

export class Attributes extends React.Component<{ moduleId: number, characterStore: CharacterStore, store: Store<List<Attribute>> }, {}> {
  render() {
    const { store, characterStore, moduleId } = this.props;
    const attributeValues = store.get().map(attr => {
      const modifier = characterStore.getModifier(attr.statId, `${moduleId}/${attr.statId}`);
      return {
        attr,
        baseValue: modifier && typeof modifier.value == 'number' ? modifier.value : 0,
        value: characterStore.getStatValue(attr.statId),
        mod: characterStore.getStatValue(`${attr.statId}-mod`)
      };
    }).toList();
    const actionCreators = {
      onAddAttribute() {
        store.update('ADD_ATTRIBUTE', attributes => attributes.push({ id: Math.random().toString(), statId: '', displayName: '' }));
      },
      onRemoveAttribute(index: number) {
        store.update('REMOVE_ATTRIBUTE', attributes => attributes.delete(index));
      },
      onAttributeChange(attribute: Attribute, value: number) {
        setAttributeModifier(characterStore, moduleId, attribute.statId, attribute, value);
      },
      onAttributeStatIdChange(attr: Attribute, index: number, newStatId: string) {
        const modifier = characterStore.getModifier(attr.statId, `${moduleId}/${attr.statId}`);
        if (modifier) {
          characterStore.removeStatModifier(attr.statId, `${moduleId}/${attr.statId}`);
          characterStore.removeStatModifier(`${attr.statId}-mod`, `${moduleId}/${attr.statId}-mod`);
        }
        setAttributeModifier(characterStore, moduleId, newStatId, attr, modifier ? modifier.value : 0);
        store.update('SET_ATTRIBUTE_STAT_ID', attributes => attributes.set(index, { ...attributes.get(index), statId: newStatId }));
      }
    };

    return <AttributesPresentation {...actionCreators} attributeValues={attributeValues} />;
  }
}

function setAttributeModifier(characterStore: CharacterStore, moduleId: number, statId: string, attr: Attribute, value: any) : void {
  characterStore.setStatModifier({
    id: `${moduleId}/${statId}`,
    description: `Base ${attr.displayName}`,
    value, statId, moduleId,
  });
  characterStore.setStatModifier({
    id: `${moduleId}/${statId}-mod`,
    statId: `${statId}-mod`,
    moduleId,
    value: { statId, factor: 0.5, round: 'DOWN' },
    description: `Base ${attr.displayName} mod`
  });
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
            {view: <TextField id={`stat_id_${attr.id}`} defaultValue={attr.statId} onChange={(e : React.FormEvent<HTMLInputElement>) => onAttributeStatIdChange(attr, i, e.currentTarget.value)} /> },
            {view: <NumberInput id={`value_${attr.id}`} name={attr.statId} defaultValue={baseValue} onValid={newValue => onAttributeChange(attr, newValue)}/> },
            {view: <span>{value}</span> },
            {view: <span>{mod}</span> },
        ],
        onDelete: () => onRemoveAttribute(i)
      })).toArray()}
      onAdd={onAddAttribute}
  />
}