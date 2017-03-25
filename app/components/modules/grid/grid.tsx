import * as React from 'react';
import { Character, getOrCreateStat, generateStatId } from 'data/character';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { StatField } from 'components/stat_field/stat_field';
import { AppState } from 'data/app_state';
import { VerticalTable } from '../../vertical_table/vertical_table';
import TextField from 'material-ui/TextField';


type Column = {
  type: 'LABEL' | 'STAT',
  displayName: string
}

type Row = {
  values: string[]
}

type Grid = {
  columns: Column[]
  rows: Row[]
}

export const MODULE_TYPE = 'GRID_MODULE';

export function addToCharacter(character: Character, moduleId: number, state: Grid) : void {

}

@observer
export class GridModule extends React.Component<{ moduleId: number, character: Character, appState: AppState, state: Grid }, {}> {

  render() {
    const { character, appState, state } = this.props;
    const { rows, columns } = state;
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

    return <VerticalTable rows={tableRows} cols={columns} onAddRow={this.onAddRow} onDeleteRow={this.onDeleteRow} />
  }

  @action
  onLabelChange = (rowIndex: number, columnIndex: number, e: React.FormEvent<HTMLInputElement>) => {
    this.props.state.rows[rowIndex].values[columnIndex] = e.currentTarget.value;
  };

  @action
  onAddRow = () => {
    const { rows, columns } = this.props.state;
    rows.push({
      values: columns.map(column => {
        switch (column.type) {
          case 'LABEL': return '';
          case 'STAT': return generateStatId(this.props.character);
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
  onAddColumn = () => {

  }
}
