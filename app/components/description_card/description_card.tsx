import * as React from 'react';
import { Description } from 'data/character';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import * as DropZone from 'react-dropzone';
import * as styles from './description_card.css';
import { TextEditor } from 'components/text_editor/text_editor';
import { TextState } from 'data/text_state';
import { FileUploader } from 'services/file_uploader';

type Props = {
  description: Description
};

@observer
export class DescriptionCard extends React.Component<Props, {}> {

  fileUploader: FileUploader = new FileUploader();
  @observable uploadPreview?: string;
  @observable uploadPercentage: number = 0;

  render() {
    return (
        <DropZone onDrop={this.onImageDrop}
                  accept="image/*"
                  disableClick={true}
                  multiple={false}
                  className={styles.dropZone} activeClassName={styles.activeDropZone}>
          {this.renderDescription()}
        </DropZone>
    );
  }

  private renderDescription() {
    const { description } = this.props;
    switch (description.type) {
      case 'IMAGE':
        const url = this.uploadPreview || description.imageUrl;
        return <img className={styles.image} src={url || ''}/>;
      case 'TEXT':
        return <TextEditor textState={description.textState} onChange={this.onEditorChange}/>;
      default:
        throw new Error(`Unknown description type ${description.type}`);
    }
  }

  @action
  private readonly onImageDrop = ([file]: (File & { preview: string })[]) => {
    this.props.description.type = 'IMAGE';
    this.uploadPreview = file.preview;
    this.uploadPercentage = 0;
    this.fileUploader.upload(file, action((uploaded: number, total: number) => {
      this.uploadPercentage = Math.floor(uploaded / total * 100);
    })).then(action((url: string) => {
      this.uploadPreview = undefined;
      this.props.description.imageUrl = url;
    }));
  };

  @action
  private readonly onEditorChange = (state: TextState) => {
    const { description } = this.props;
    description.textState = state;
  }
}