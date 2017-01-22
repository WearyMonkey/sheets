import React from 'react';

type Column = {
  displayName: string
}

type Row = {
  elements: Array<React.Element<any>>
}

export class VerticalTable extends React.Component {

  props: { editMode: boolean, rows: Array<Row>, cols: Array<Column> };

  render() {
    const { editMode, cols, rows } = this.props;
    return <table>
      <tr>
        {cols.map(col =>
          <th>{col.displayName}</th>
        )}
      </tr>
      {rows.map(row =>
        <tr>
          {row.elements.map(e =>
              <td>{e}</td>
          )}
        </tr>
      )}
    </table>;
  }
}