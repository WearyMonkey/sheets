import * as React from 'react';
import * as styles from './verticale_table.css';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

type Column = {
  displayName: string
}

type Row = {
  elements: Array<React.ReactElement<any>>
}

@observer
export class VerticalTable extends React.Component<{
  rows: Array<Row>,
  cols: Array<Column>,
  onAddRow?: () => void,
  onAddColumn?: (option?: any) => void,
  onDeleteRow?: (row: number) => void,
  onDeleteColumn?: (column: number) => void,
  onColumnChange?: (i: number, value: string) => void
  editMode?: boolean,
  addColumnOptions?: { displayName: string, id: string|number }[]
}, {}> {

  @observable addColumnMenuAnchor: Element|null = null;

  render() {
    const { cols, rows, onAddRow, onDeleteRow, onDeleteColumn, editMode, addColumnOptions } = this.props;
    const width = `${100 / cols.length}%`;
    return <div>
      <table className={styles.table}>
        <thead>
          <tr>
            {cols.map((col, i) =>
              <th key={i}>
                {this.props.onColumnChange
                  ? (<TextField fullWidth={true} value={col.displayName} onChange={(e: React.FormEvent<HTMLInputElement>) => this.props.onColumnChange!(i, e.currentTarget.value)} />)
                  : col.displayName
                }
                {editMode && onDeleteColumn &&
                  <IconButton onClick={() => onDeleteColumn(i)} className={styles.deleteColumn}><RemoveCircle/></IconButton>
                }
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) =>
            <tr key={i}>
              {row.elements.map((e, i) =>
                  <td style={{ width }} key={i}>{e}</td>
              )}
              {editMode && onDeleteRow &&
                <td>
                  <IconButton onClick={() => onDeleteRow(i)}><RemoveCircle/></IconButton>
                </td>
              }
            </tr>
          )}

        </tbody>
      </table>
      {editMode &&
        <div>
          {this.props.onAddRow &&
            <FlatButton onClick={onAddRow}>Add Row</FlatButton>
          }
          {this.props.onAddColumn &&
            <FlatButton onClick={this.onAddColumn}>Add Column</FlatButton>
          }
          {addColumnOptions &&
            <Popover
                open={!!this.addColumnMenuAnchor}
                anchorEl={this.addColumnMenuAnchor!}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.onCloseColumnMenu}
            >
              <Menu>
                {addColumnOptions.map(option =>
                    <MenuItem key={option.id} primaryText={option.displayName} onClick={() => this.onAddColumnSelect(option)} />
                )}
              </Menu>
            </Popover>
          }
        </div>
      }
    </div>;
  }

  @action
  onAddColumnSelect = (option: {displayName: string, id: string|number}) => {
    this.addColumnMenuAnchor = null;
    if (this.props.onAddColumn) {
      this.props.onAddColumn(option);
    }
  };

  @action
  onAddColumn = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (this.props.addColumnOptions) {
      this.addColumnMenuAnchor = e.currentTarget;
    } else if (this.props.onAddColumn) {
      this.props.onAddColumn();
    }
  };

  @action
  onCloseColumnMenu = () => {
    this.addColumnMenuAnchor = null;
  };
}