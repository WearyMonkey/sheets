import * as React from 'react';
import { ChangeEvent } from 'react';
import { Character, evaluateModifier, Modifier } from 'data/character';
import { observer } from 'mobx-react';
import TextField from 'material-ui/TextField';
import { action, observable, runInAction } from 'mobx';
import { Parser } from 'expr-eval';
import * as styles from './modifier_card.css';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ArrayDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import { DescriptionCard } from "../description_card/description_card";

type Props = {
  character: Character,
  modifier: Modifier,
  showStatId: boolean,
};

@observer
export class ModifierCard extends React.Component<Props> {

  @observable private currentValue = this.props.modifier.value;

  componentWillReceiveProps(nextProps: Props) {
    runInAction(() => {
      this.currentValue = nextProps.modifier.value;
    });
  }

  render() {
    const { character, modifier, showStatId } = this.props;
    const total = evaluateModifier(character, modifier);
    return (
        <div className={styles.card}>
          <div className={styles.left}>
            {showStatId && (
                <TextField
                    name={`${modifier.id}_stat_id`}
                    fullWidth={true}
                    value={modifier.statId}
                    onChange={this.onStatIdChange}
                    hintText="Stat Id"/>
            )}
            <DescriptionCard description={modifier.description}/>
            <TextField
                name={`${modifier.id}_card_value`}
                hintText="Value"
                fullWidth={true}
                value={this.currentValue}
                onChange={this.onChange}
                onBlur={this.onBlur}/>
          </div>
          <div className={styles.right}>
            <IconMenu iconButtonElement={<IconButton><ArrayDropDownIcon/></IconButton>}>
              <MenuItem primaryText="Delete" onClick={this.onDelete}/>
              <MenuItem primaryText="Enabled"/>
            </IconMenu>
            <div className={styles.total}>{total}</div>
          </div>
        </div>
    );
  }

  @action
  private readonly onStatIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.props.modifier.statId = e.currentTarget.value;
  };

  @action
  private readonly onDelete = () => {
    const { character: { modifiers }, modifier } = this.props;
    modifiers.splice(modifiers.indexOf(modifier), 1);
  };

  @action
  private readonly onBlur = () => {
    this.currentValue = this.props.modifier.value;
  };

  @action
  private readonly onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;
    this.currentValue = newValue;
    if (validateValue(newValue)) {
      this.props.modifier.value = newValue;
    }
  };
}

function validateValue(value: string): boolean {
  try {
    Parser.parse(value);
  } catch (e) {
    return false;
  }
  return true;
}