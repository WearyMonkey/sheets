import * as React from 'react';
import { Description } from 'data/character';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import * as DropZone from 'react-dropzone';
import * as styles from './description_card.css';
import ChangeEvent = React.ChangeEvent;
import { TextEditor } from 'components/text_editor/text_editor';
import { TextState } from 'data/text_state';
import { FileUploader } from 'services/file_uploader';

@observer
export class DescriptionCard extends React.Component<{description: Description}, { }> {

  fileUploader: FileUploader = new FileUploader();

  render() {
    const { description } = this.props;
    let content;
    switch (description.type) {
      case 'IMAGE':
        content = <img src={description.imageUrl || ''}/>;
        break;
      case 'TEXT':
        content = <TextEditor textState={description.textState} onChange={this.onEditorChange} />;
        break;
    }

    return (<DropZone onDrop={this.onImageDrop} accept="image/*" disableClick={true} multiple={false} className={styles.dropZone} activeClassName={styles.activeDropZone} >
      { content }
    </DropZone>);
  }

  @action
  onImageDrop = ([file] : {}[]) => {

  };

  @action
  onEditorChange = (state: TextState) => {
    const { description } = this.props;
    description.textState = state;
  }
}