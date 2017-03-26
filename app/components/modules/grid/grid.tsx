import * as React from 'react';
import { Character, getOrCreateStat, generateStatId } from 'data/character';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { StatField } from 'components/stat_field/stat_field';
import { AppState } from 'data/app_state';
import { VerticalTable } from '../../vertical_table/vertical_table';
import TextField from 'material-ui/TextField';
import { ModuleHeader } from 'components/module_header/module_header';

type Column = {
  type: 'LABEL' | 'STAT',
  displayName: string
}

type Row = {
  values: string[]
}

type Grid = {
  title: string,
  columns: Column[]
  rows: Row[]
}

export const MODULE_TYPE = 'GRID_MODULE';

export function addToCharacter(character: Character, moduleId: number, state: Grid) : void {

}

@observer
export class GridModule extends React.Component<{ moduleId: number, character: Character, appState: AppState, state: Grid }, {}> {

  @observable editMode: boolean = false;

  render() {
    const { character, appState, state } = this.props;
    const { title, rows, columns } = state;
    const tableRows = rows.map((row, r) => {
      const elements = row.values.map((value, c) => {
        const column = columns[c];
        switch (column.type) {
          case 'LABEL': return <TextField fullWidth={true} value={value} onChange={(e: any) => this.onLabelChange(r, c, e)} />;
          case 'STAT': return <StatField character={character} appState={appState} statId={value} />;
          default: throw new Error(`Unknown column type ${column.type}`);
        }
      });
      return { elements };
    });

    return (<div>
      <ModuleHeader title={title} onEditMode={this.onEditMode} />
      <VerticalTable
          rows={tableRows} cols={columns}
          onAddRow={this.onAddRow} onDeleteRow={this.onDeleteRow} onColumnChange={this.onColumnChange}
          onAddColumn={this.onAddColumn} onDeleteColumn={this.onDeleteColumn}
          addColumnOptions={[
              { displayName: 'Label', id: 'LABEL' },
              { displayName: 'Stat', id: 'STAT' },
          ]}
          editMode={this.editMode} />
    </div>);
  }

  @action
  onDeleteColumn = (index: number) => {
    const { rows, columns } = this.props.state;
    columns.splice(index, 1);
    rows.forEach(row => row.values.splice(index, 1));
  };

  @action
  onColumnChange = (index: number, value: string) => {
    this.props.state.columns[index].displayName = value;
  };

  @action
  onEditMode = (editMode: boolean) => {
    this.editMode = editMode;
  };

  @action
  onLabelChange = (rowIndex: number, columnIndex: number, e: React.FormEvent<HTMLInputElement>) => {
    this.props.state.rows[rowIndex].values[columnIndex] = e.currentTarget.value;
  };

  @action
  onAddRow = () => {
    const { state, character } = this.props;
    const { rows, columns } = state;
    rows.push({
      values: columns.map(column => {
        switch (column.type) {
          case 'LABEL': return '';
          case 'STAT':
            const statId = generateStatId(this.props.character);
            getOrCreateStat(character, statId);
            return statId;
          default: throw new Error(`Unknown column type ${column.type}`);
        }
      })
    });
  };

  @action
  onDeleteRow = (rowIndex: number) => {
    const { rows } = this.props.state;
    rows.splice(rowIndex, 1);
  };

  @action
  onAddColumn = ({ id }: { id: string }) => {
    const { state, character } = this.props;
    const { rows, columns } = state;
    switch (id) {
      case 'LABEL':
        columns.push({ displayName: '', type: id });
        rows.forEach(row => {
          row.values.push('');
        });
        break;
      case 'STAT':
        const statId = generateStatId(this.props.character);
        getOrCreateStat(character, statId);
        columns.push({ displayName: '', type: id });
        rows.forEach(row => {
          row.values.push(statId);
        });
        break;
      default: throw new Error(`Unknown column type ${id}`);
    }

  }
}
