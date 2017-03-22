import * as React from 'react';
import { Description } from 'data/character';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import * as DropZone from 'react-dropzone';
import * as styles from './description_card.css';
import ChangeEvent = React.ChangeEvent;
import { TextEditor } from 'components/text_editor/text_editor';
import { TextState } from 'data/text_state';

@observer
export class DescriptionCard extends React.Component<{description: Description}, { }> {

  render() {
    const { description } = this.props;
    let content;
    switch (description.type) {
      case 'IMAGE':
        content = <img src={description.url}/>;
        break;
      case 'TEXT':
        content = <TextEditor textState={description.state} onChange={this.onEditorChange} />;
        break;
    }

    return (<DropZone disableClick={true} className={styles.dropZone} activeClassName={styles.activeDropZone} >
      { content }
    </DropZone>);
  }

  @action
  onEditorChange = (state: TextState) => {
    const { description } = this.props;
    description.type = 'TEXT';
    if (description.type == 'TEXT') {
      description.state = state;
    }
  }
}