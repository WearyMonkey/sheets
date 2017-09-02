import * as React from 'react';
import { Character, Modifier, evaluateModifier } from 'data/character';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import { action, observable } from 'mobx';
import { Parser } from 'expr-eval';
import * as styles from './modifier_card.css';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ArrayDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';

type Props = {
  character: Character,
  modifier: Modifier,
  onDelete: () => void
};

@observer
export class ModifierCard extends React.Component<Props, { currentValue: string }> {

  state = { currentValue: this.props.modifier.value };

  componentWillReceiveProps(nextProps: Props) {
    this.setState({ currentValue: nextProps.modifier.value });
  }

  render() {
    const { character, modifier, onDelete } = this.props;
    const { currentValue } = this.state;
    const total = evaluateModifier(character, modifier);
    return (
      <div className={styles.card}>
        <div className={styles.left}>
          <TextField name={`${modifier.id}_card_description`} hintText="Description" fullWidth={true} value={modifier.description} onChange={this.onDescriptionChange} />
          <TextField name={`${modifier.id}_card_value`} hintText="Value" fullWidth={true} value={currentValue} onChange={this.onChange} onBlur={this.onBlur} />
        </div>
        <div className={styles.right}>
          <IconMenu
              iconButtonElement={<IconButton><ArrayDropDownIcon /></IconButton>}
          >
            <MenuItem primaryText="Delete" onClick={onDelete} />
            <MenuItem primaryText="Enabled" />
          </IconMenu>
          <div className={styles.total}>{total}</div>
        </div>
      </div>
    );
  }

  @action
  private readonly onDescriptionChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.modifier.description = e.currentTarget.value;
  };

  @action
  private readonly onBlur = () => {
    this.setState({ currentValue: this.props.modifier.value });
  };

  @action
  private readonly onChange = (event: React.FormEvent<HTMLInputElement>) => {
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