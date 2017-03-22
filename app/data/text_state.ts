import { observable } from 'mobx';
import { ContentState } from 'draft-js';

export class TextState {
  @observable.ref readonly content: ContentState;

  private constructor(content: ContentState) {
    this.content = content;
  }

  static createFromText(text: string) {
    return new TextState(ContentState.createFromText(text));
  }
  static createFromContent(content: ContentState) {
    return new TextState(content);
  }
}
