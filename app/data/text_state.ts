import { observable } from 'mobx';
import { ContentState, convertToRaw, convertFromRaw } from 'draft-js';

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

  static toJson(textState: TextState): any {
    return { 'content': convertToRaw(textState.content) }
  }

  static fromJson(json: any) {
    return TextState.createFromContent(convertFromRaw(json['content']));
  }
}
