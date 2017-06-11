import * as React from 'react';
import { Character, getOrCreateStat, generateStatId } from 'data/character';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { StatField } from 'components/stat_field/stat_field';
import { AppState } from 'data/app_state';
import { VerticalTable } from '../../vertical_table/vertical_table';
import TextField from 'material-ui/TextField';
import { ModuleHeader } from 'components/module_header/module_header';
import MenuItem from 'material-ui/MenuItem';

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
export class GridModule extends React.Component<{ moduleId: number, character: Character, appState: AppState, state: Grid, onDelete: () => void }, {}> {

  @observable editMode: boolean = false;

  render() {
    const { moduleId, character, appState, state, onDelete } = this.props;
    const { title, rows, columns } = state;
    const tableRows = rows.map((row, r) => {
      const elements = row.values.map((value, c) => {
        const column = columns[c];
        switch (column.type) {
          case 'LABEL': return <TextField name={`${moduleId}_column_header_${c}`} hintText="Label" fullWidth={true} value={value} onChange={(e: any) => this.onLabelChange(r, c, e)} />;
          case 'STAT': return <StatField character={character} appState={appState} statId={value} onStatIdChange={(statId: string) => this.onStatIdChange(statId, r, c)} />;
          default: throw new Error(`Unknown column type ${column.type}`);
        }
      });
      return { elements };
    });

    const menuItems = [
      <MenuItem key="edit" primaryText="Edit" onClick={this.onEditMode} />
    ];

    return (<div>
      <ModuleHeader title={title} menuItems={menuItems} onDelete={onDelete} onTitleChange={this.onTitleChange} />
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
  onTitleChange = (title: string) => {
    this.props.state.title = title;
  };

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
  onEditMode = () => {
    this.editMode = !this.editMode;
  };

  @action
  onLabelChange = (rowIndex: number, columnIndex: number, e: React.FormEvent<HTMLInputElement>) => {
    this.props.state.rows[rowIndex].values[columnIndex] = e.currentTarget.value;
  };

  @action
  onStatIdChange = (statId: string, row: number, col: number) => {
    this.props.state.rows[row].values[col] = statId;
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
        columns.push({ displayName: '', type: 'LABEL' });
        rows.forEach(row => {
          row.values.push('');
        });
        break;
      case 'STAT':
        const statId = generateStatId(this.props.character);
        getOrCreateStat(character, statId);
        columns.push({ displayName: '', type: 'STAT' });
        rows.forEach(row => {
          row.values.push(statId);
        });
        break;
      default: throw new Error(`Unknown column type ${id}`);
    }

  }
}
