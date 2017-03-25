import * as React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import ChangeEvent = React.ChangeEvent;
import { Editor, EditorState } from 'draft-js';
import { TextState } from 'data/text_state';

@observer
export class TextEditor extends React.Component<{textState?: TextState|null, onChange?: (textState: TextState) => void}, { }> {

  @observable.ref editorState: EditorState|null = null;
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
  onBlur = () => this.focused = false;

  @action
  onFocus = () => this.focused = true;

  @action
  onEditorChange = (state: EditorState) => {
    this.editorState = state;
    if (this.props.onChange) {
      this.props.onChange(TextState.createFromContent(state.getCurrentContent()));
    }
  }
}