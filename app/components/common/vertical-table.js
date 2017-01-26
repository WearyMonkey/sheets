import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './verticale-table.scss';

type Column = {
  displayName: string
}

type Row = {
  elements: Array<{view: React.Element<any>, edit: React.Element<any>|null}>,
  onDelete: () => void
}

export class VerticalTable extends React.Component {

  props: {
    editMode: boolean,
    rows: Array<Row>,
    cols: Array<Column>,
    onAdd: () => void,
  };

  render() {
    const { editMode, cols, rows, onAdd } = this.props;
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
                  <td key={i}>{editMode ? e.edit || e.view : e.view}</td>
              )}
              {editMode &&
                <td>
                  <RaisedButton onClick={() => row.onDelete(i)}>Delete</RaisedButton>
                </td>
              }
            </tr>
          )}

        </tbody>
      </table>
      {editMode &&
        <RaisedButton onClick={onAdd}>Add</RaisedButton>
      }
    </div>;
  }
}