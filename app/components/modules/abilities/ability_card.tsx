import * as React from 'react';
import { Ability } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { AppState } from 'data/app_state';

type Props = {
  ability: Ability,
  appState: AppState,
};

@observer
export class AbilityCard extends React.Component<Props> {
  render() {
    const { ability } = this.props;
    return (<div onClick={this.handleClick}>
      <DescriptionCard description={ability.description}/>
    </div>);
  }

  @action
  handleClick = () => {
    this.props.appState.selectedAbility = this.props.ability;
  }
}