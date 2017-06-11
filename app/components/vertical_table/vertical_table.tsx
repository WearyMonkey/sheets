import * as React from 'react';
import * as styles from './verticale_table.css';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle';
import ArrayDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

type Column = {
  displayName: string,
  onlyVisibleInEdit?: boolean,
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
  onColumnTitleChange?: (i: number, value: string) => void
  editMode?: boolean,
  addColumnOptions?: { displayName: string, id: string|number }[]
}, {}> {

  @observable addColumnMenuAnchor?: Element;
  @observable columnOptionsAnchor?: Element;
  @observable columnMenu?: number;

  render() {
    const { cols, rows, onAddRow, onDeleteRow, editMode, addColumnOptions } = this.props;
    const width = `${100 / cols.length}%`;
    return <div>
      <table className={styles.table}>
        <thead>
          <tr>
            {cols.map((col, i) =>
              <th key={i}>
                {this.props.onColumnTitleChange
                  ? (<TextField name={`header_${i}`} hintText="Header" fullWidth={true} value={col.displayName} onChange={this.onColumnTitleChange.bind(this, i)} />)
                  : col.displayName
                }
                {editMode &&
                  <IconButton className={styles.deleteColumn} onClick={this.onOpenColumnOptionsMenu .bind(this, i)}><ArrayDropDownIcon /></IconButton>
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
          <Popover
              open={!!this.columnOptionsAnchor}
              anchorEl={this.columnOptionsAnchor!}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.onCloseColumnOptionsMenu}
          >
            <Menu>
              {this.props.onDeleteColumn &&
                <MenuItem primaryText="Delete" onClick={this.onDeleteColumn}/>
              }
            </Menu>
          </Popover>
        </div>
      }
    </div>;
  }

  @action
  onDeleteColumn = () => {
    this.onCloseColumnOptionsMenu();
    this.props.onDeleteColumn!(this.columnMenu!);
  };

  @action
  onOpenColumnOptionsMenu = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    this.columnOptionsAnchor = e.currentTarget;
    this.columnMenu = i;
  };

  @action
  onCloseColumnOptionsMenu = () => {
    this.columnOptionsAnchor = undefined;
    this.columnMenu = undefined;
  };

  @action
  onColumnTitleChange = (i: number, e: React.FormEvent<HTMLInputElement>) => {
    if (this.props.onColumnTitleChange) {
      this.props.onColumnTitleChange(i, e.currentTarget.value)
    }
  };

  @action
  onAddColumnSelect = (option: {displayName: string, id: string|number}) => {
    this.addColumnMenuAnchor = undefined;
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
    this.addColumnMenuAnchor = undefined;
  };
}