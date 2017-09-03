import * as React from 'react';
import { Action, Character, DiceRoll } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { observer } from 'mobx-react';
import { DiceRollAction } from './dice_roll_action';
import { AppState } from "../../../data/app_state";

type Props = {
  character: Character,
  appState: AppState,
  action: Action,
  abilityPanelUiAction(action: DiceRoll): void
};

@observer
export class ActionCard extends React.Component<Props> {
  render() {
    const { action } = this.props;
    return (
        <div>
          <DescriptionCard description={action.description}/>
          {this.renderAction(action)}
        </div>
    );
  }

  private renderAction({ type, diceRoll }: Action) {
    const { character, appState, abilityPanelUiAction: onRoll } = this.props;
    switch (type) {
      case 'ROLL':
        return <DiceRollAction {...{ character, appState, diceRoll, onRoll }}/>;
      default:
        throw new Error(`Unknown action type ${type}`);
    }
  }
}