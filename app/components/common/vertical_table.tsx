import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import * as styles from './verticale_table.css';

type Column = {
  displayName: string
}

type Row = {
  elements: Array<React.ReactElement<any>>,
  onDelete: (i : number) => void
}

export class VerticalTable extends React.Component<{
  rows: Array<Row>,
  cols: Array<Column>,
  onAdd: () => void,
}, {}> {
  render() {
    const { cols, rows, onAdd } = this.props;
    return <div>
      <table className={styles.table}>
        <thead>
          <tr>
            {cols.map((col, i) =>
              <th key={i}>{col.displayName}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) =>
            <tr key={i}>
              {row.elements.map((e, i) =>
                  <td key={i}>{e}</td>
              )}
              <td>
                <RaisedButton onClick={() => row.onDelete(i)}>Delete</RaisedButton>
              </td>
            </tr>
          )}

        </tbody>
      </table>
      <RaisedButton onClick={onAdd}>Add</RaisedButton>
    </div>;
  }
}