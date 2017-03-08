import * as React from 'react';
import { Modifier } from '../../data/character';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import ChangeEvent = React.ChangeEvent;
import { action, observable } from 'mobx';
import { Parser } from 'expr-eval';

type Props = { modifier: Modifier };

@observer
export class ModifierCard extends React.Component<Props, { currentValue: string }> {

  constructor(props: Props) {
    super(props);
    this.state = { currentValue: props.modifier.value };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ currentValue: nextProps.modifier.value });
  }

  render() {
    return <div>
      <TextField value={this.state.currentValue} onChange={this.onChange} onBlur={this.onBlur} />
    </div>;
  }

  @action onBlur = () => {
    this.setState({ currentValue: this.props.modifier.value });
  };

  @action onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    this.setState({ currentValue: newValue });
    if (validateValue(newValue)) {
      this.props.modifier.value = newValue;
    }
  };
}

function validateValue(value: string) : boolean {
  try {
    Parser.parse(value);
  } catch (e) {
    return false;
  }
  return true;
}