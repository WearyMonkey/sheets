import * as React from 'react';
import * as styles from './module_header.css';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ArrayDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import { observer } from 'mobx-react';
import { action } from "mobx";
import { Sheet } from "../../data/sheet";

type Props = {
  sheet: Sheet,
  moduleId: string,
  title: string,
  menuItems: JSX.Element[],
  onTitleChange(title: string): void
};

@observer
export class ModuleHeader extends React.Component<Props> {

  render() {
    const { title, menuItems } = this.props;
    return (<div className={styles.header}>
      <TextField
          name="module_header"
          className={styles.title}
          value={title}
          onChange={this.onTitleChange}/>
      <IconMenu
          className={styles.menuDropDown}
          anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
          iconButtonElement={<IconButton><ArrayDropDownIcon/></IconButton>}>
        {menuItems}
        <MenuItem primaryText="Delete" onClick={this.onDelete}/>
        <MenuItem primaryText="Move Up" onClick={this.onMoveUp}/>
        <MenuItem primaryText="Move Down" onClick={this.onMoveDown}/>
      </IconMenu>
    </div>);
  }

  private readonly onTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.onTitleChange(e.currentTarget.value);
  };

  @action
  private readonly onDelete = () => {
    const { sheet: { modules }, moduleId } = this.props;
    modules.splice(modules.findIndex(m => m.id == moduleId), 1);
  };

  @action
  private readonly onMoveUp = () => {
    const { sheet: { modules }, moduleId } = this.props;
    const index = modules.findIndex(m => m.id == moduleId);
    modules.splice(index - 1, 0, modules[index]);
    modules.splice(index + 1, 1);
  };

  @action
  private readonly onMoveDown = () => {
    const { sheet: { modules }, moduleId } = this.props;
    const index = modules.findIndex(m => m.id == moduleId);
    modules.splice(index + 2, 0, modules[index]);
    modules.splice(index, 1);
  }
}