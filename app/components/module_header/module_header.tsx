import * as React from 'react';
import * as styles from './module_header.css';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ArrayDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import { observer } from 'mobx-react';

@observer
export class ModuleHeader extends React.Component<
    {title: string, menuItems: JSX.Element[], onDelete: () => void, onTitleChange: (title: string) => void }, {}> {

  constructor(props: any) {
    super(props);
    this.state = { editMode: false };
  }

  render() {
    const { title, menuItems, onDelete } = this.props;
    return (<div className={styles.header}>
      <TextField className={styles.title} value={title} onChange={this.onTitleChange} />
      <IconMenu
          className={styles.menuDropDown}
          anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
          iconButtonElement={<IconButton><ArrayDropDownIcon /></IconButton>}
      >
        {menuItems}
        <MenuItem primaryText="Delete" onClick={onDelete} />
      </IconMenu>
    </div>);
  }

  onTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.onTitleChange(e.currentTarget.value);
  }
}