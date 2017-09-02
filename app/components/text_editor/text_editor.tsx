import * as React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Editor, EditorState } from 'draft-js';
import { TextState } from 'data/text_state';

type Props = {
  textState?: TextState,
  onChange?(textState: TextState): void,
};

@observer
export class TextEditor extends React.Component<Props, { }> {

  @observable.ref editorState?: EditorState;
  @observable focused: boolean = false;

  render() {
    let editorState;
    if (this.focused && this.editorState) {
      editorState = this.editorState;
    } else {
      editorState = this.props.textState
          ? EditorState.createWithContent(this.props.textState.content)
          : EditorState.createEmpty();
    }
    return <Editor editorState={editorState} onChange={this.onEditorChange} onFocus={this.onFocus} onBlur={this.onBlur} />;
  }

  @action
  private readonly onBlur = () => {
    this.focused = false;
  };

  @action
  private readonly onFocus = () => {
    this.focused = true;
  };

  @action
  private readonly onEditorChange = (state: EditorState) => {
    this.editorState = state;
    if (this.props.onChange) {
      this.props.onChange(TextState.createFromContent(state.getCurrentContent()));
    }
  }
}