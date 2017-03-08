import * as React from 'react';
import { Ability } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { AppState } from 'data/app_state';

@observer
export class AbilityCard extends React.Component<{ ability: Ability, appState: AppState }, {}> {
  render() {
    const { ability } = this.props;
    return (<div onClick={this.handleClick}>
      <DescriptionCard description={ability.description} />
    </div>);
  }

  @action
  handleClick = () => {
    this.props.appState.selectedAbility = this.props.ability;
  }
}