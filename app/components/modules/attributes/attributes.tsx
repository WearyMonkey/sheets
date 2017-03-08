import * as React from 'react';
import { Character, getOrCreateStat, generateStatId } from 'data/character';
import { VerticalTable } from 'components/vertical_table/vertical_table';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { StatField } from 'components/stat_field/stat_field';
import { AppState } from 'data/app_state';

type Attribute = {
  id: string,
  statId: string,
  displayName: string,
}

export const MODULE_TYPE = 'ATTRIBUTES_MODULE';

export function addToCharacter(character: Character, moduleId: number, state: Attribute[]) : void {
  state.forEach(attr => {
    initialiseAttribute(moduleId, character, attr);
  });
}

@observer
export class Attributes extends React.Component<{ moduleId: number, character: Character, state: Attribute[], appState: AppState }, {}> {
  render() {
    const { state, character, appState } = this.props;
    return (<VerticalTable
      cols={[
        {displayName: 'Attribute'},
        {displayName: 'Base'},
        {displayName: 'Mod'},
    ]}
    rows={state.map(attr => ({
      elements: [
          <span>{attr.displayName}</span>,
          <StatField statId={attr.statId} character={character} appState={appState} />,
          <StatField statId={`${attr.statId}-mod`} character={character} appState={appState} />,
      ],
      onDelete: this.onRemoveAttribute
    }))}
    onAdd={this.onAddAttribute}
    />);
  }

  @action
  onAddAttribute = () => {
    const character = this.props.character;
    const attribute = { id: Math.random().toString(), statId: generateStatId(character), displayName: 'Attribute' };
    this.props.state.push(attribute);
    initialiseAttribute(this.props.moduleId, character, attribute);
  };

  @action
  onRemoveAttribute = (index: number) => {
    this.props.state.splice(index, 1);
  };
}

function initialiseAttribute(moduleId: number, character: Character, attr: Attribute) {
  const baseStateId = attr.statId;
  const baseModId = `${moduleId}-${baseStateId}`;
  const baseStat = getOrCreateStat(character, baseStateId);
  if (!baseStat.modifiers.has(baseModId)) {
    baseStat.modifiers.set(baseModId, { id: baseModId, description: `Base ${attr.displayName}`, value: '0', moduleId });
  }

  const modStatId = `${baseStateId}-mod`;
  const modModId = `${baseModId}-mod`;
  const modStat = getOrCreateStat(character, modStatId);
  modStat.modifiers.set(modModId, { id: modModId, description: `Mod ${attr.displayName}`, value: `floor(${baseStateId} / 2)`, moduleId });
}