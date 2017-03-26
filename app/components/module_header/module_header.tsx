import * as React from 'react';
import * as styles from './module_header.css';
import IconButton from 'material-ui/IconButton';
import Create from 'material-ui/svg-icons/content/create';

export class ModuleHeader extends React.Component<{title: string, onEditMode?: (editMode :boolean) => void}, {editMode: boolean}> {

  constructor(props: any) {
    super(props);
    this.state = { editMode: false };
  }

  render() {
    const { title, onEditMode } = this.props;
    return (<div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {onEditMode &&
        <IconButton onClick={this.onEditMode} className={styles.icon}><Create /></IconButton>
      }
    </div>)
  }

  onEditMode = () => {
    this.setState({editMode: !this.state.editMode});
    if (this.props.onEditMode) {
      this.props.onEditMode(!this.state.editMode);
    }
  }
}