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
  @observable uploadPreview?: string|null;
  @observable uploadPercentage: number = 0;

  render() {
    const { description } = this.props;
    let content;
    switch (description.type) {
      case 'IMAGE':
        const url = this.uploadPreview || description.imageUrl;
        content = <img className={styles.image} src={url || ''}/>;
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
  onImageDrop = ([file] : (File & {preview: string})[]) => {
    this.props.description.type = 'IMAGE';
    this.uploadPreview = file.preview;
    this.uploadPercentage = 0;
    this.fileUploader.upload(file, action((uploaded: number, total: number) => {
      this.uploadPercentage = Math.floor(uploaded / total * 100);
    })).then(action((url: string) => {
      this.uploadPreview = null;
      this.props.description.imageUrl = url;
    }));
  };

  @action
  onEditorChange = (state: TextState) => {
    const { description } = this.props;
    description.textState = state;
  }
}