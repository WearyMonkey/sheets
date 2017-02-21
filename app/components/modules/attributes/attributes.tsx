import * as React from 'react';
import * as styles from './attributes.css';
import NumberInput from 'material-ui-number-input';
import TextField from 'material-ui/TextField';
import { Character } from 'data/character';
import { VerticalTable } from 'components/common/vertical-table';
import { observer } from 'mobx-react';
import { action } from 'mobx';

type Attribute = {
  id: string,
  statId: string,
  displayName: string,
}

export const MODULE_TYPE = 'ATTRIBUTES_MODULE';

export function addToCharacter(character: Character, moduleId: number, state: Attribute[]) : void {
  state.forEach(attr => {
    const modifier = character.getModifier(attr.statId, `${moduleId}/${attr.statId}`);
    if (modifier) {
      setAttributeModifier(character, moduleId, attr.statId, attr, 0)
    }
  });
}

@observer
export class Attributes extends React.Component<{ moduleId: number, character: Character, state: Attribute[] }, {}> {
  render() {
    const { state, character, moduleId } = this.props;
    const attributeValues = state.map(attr => {
      const modifier = character.getModifier(attr.statId, `${moduleId}/${attr.statId}`);
      return {
        attr,
        baseValue: modifier && typeof modifier.value == 'number' ? modifier.value : 0,
        value: character.getStatValue(attr.statId),
        mod: character.getStatValue(`${attr.statId}-mod`)
      };
    });

    return (<VerticalTable
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
            {view: <TextField id={`stat_id_${attr.id}`} defaultValue={attr.statId} onChange={(e : React.FormEvent<HTMLInputElement>) => this.onAttributeStatIdChange(attr, i, e.currentTarget.value)} /> },
            {view: <NumberInput id={`value_${attr.id}`} name={attr.statId} defaultValue={baseValue} onValid={(newValue) => this.onAttributeChange(attr, newValue)}/> },
            {view: <span>{value}</span> },
            {view: <span>{mod}</span> },
        ],
        onDelete: () => this.onRemoveAttribute(i)
      }))}
        onAdd={this.onAddAttribute}
    />
)
  }

  @action
  onAddAttribute = () => {
    this.props.state.push({ id: Math.random().toString(), statId: '', displayName: '' });
  };

  @action
  onRemoveAttribute = (index: number) => {
    this.props.state.splice(index, 1);
  };

  @action
  onAttributeChange = (attribute: Attribute, value: number) => {
    const { character, moduleId } = this.props;
    setAttributeModifier(character, moduleId, attribute.statId, attribute, value);
  };

  @action
  onAttributeStatIdChange = (attr: Attribute, index: number, newStatId: string) => {
    const { character, moduleId, state } = this.props;
    const modifier = character.getModifier(attr.statId, `${moduleId}/${attr.statId}`);
    if (modifier) {
      character.removeStatModifier(attr.statId, `${moduleId}/${attr.statId}`);
      character.removeStatModifier(`${attr.statId}-mod`, `${moduleId}/${attr.statId}-mod`);
    }
    setAttributeModifier(character, moduleId, newStatId, attr, modifier ? modifier.value : 0);
    state[index].statId = newStatId;
  }
}

function setAttributeModifier(character: Character, moduleId: number, statId: string, attr: Attribute, value: any) : void {
  character.setStatModifier({
    id: `${moduleId}/${statId}`,
    description: `Base ${attr.displayName}`,
    value, statId, moduleId,
  });
  character.setStatModifier({
    id: `${moduleId}/${statId}-mod`,
    statId: `${statId}-mod`,
    moduleId,
    value: { statId, factor: 0.5, round: 'DOWN' },
    description: `Base ${attr.displayName} mod`
  });
}