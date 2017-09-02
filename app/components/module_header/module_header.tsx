import * as React from 'react';
import * as styles from './module_header.css';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ArrayDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import { observer } from 'mobx-react';

type Props = {
  moduleId: number,
  title: string,
  menuItems: JSX.Element[],
  onDelete(moduleId: number): void,
  onTitleChange(title: string): void
};

@observer
export class ModuleHeader extends React.Component<Props, {}> {

  state = { editMode: false };

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
      </IconMenu>
    </div>);
  }

  private readonly onTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.onTitleChange(e.currentTarget.value);
  };

  private readonly onDelete = () => {
    this.props.onDelete(this.props.moduleId);
  }
}