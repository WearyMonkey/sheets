import * as React from 'react';
import { Ability, DiceRoll } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { ActionCard } from './action_card/action_card';
import { observer } from 'mobx-react';
import { DiceRoller } from './dice_roller/dice_roller';
import { observable } from 'mobx';

@observer
export class AbilityPanel extends React.Component<{ ability: Ability }, {}>{

  @observable
  diceRoll?: DiceRoll = null;

  render() {
    const { ability } = this.props;
    return <div>
      <DiceRoller diceRoll={this.diceRoll} />
      <DescriptionCard description={ability.description} />
      <div>
        {ability.actions.map((action, i) => {
          return <ActionCard key={action.id} action={action} abilityPanelUiAction={this.handleAbilityPanelUiAction} />
        })}
      </div>
    </div>
  }

  handleAbilityPanelUiAction = (diceRoll: DiceRoll) => {
    this.diceRoll = diceRoll;
  }
}