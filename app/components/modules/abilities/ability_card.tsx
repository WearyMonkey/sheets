import * as React from 'react';
import { Ability, Description } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { SheetUiActionCallback } from '../../sheet/sheet';
import { observer } from 'mobx-react';
import { action } from 'mobx';

@observer
export class AbilityCard extends React.Component<{ ability: Ability, sheetUiAction: SheetUiActionCallback }, {}> {
  render() {
    const { ability } = this.props;
    return (<div onClick={this.handleClick}>
      <DescriptionCard description={ability.description} />
    </div>);
  }

  @action
  handleClick = () => {
    const { ability, sheetUiAction } = this.props;
    sheetUiAction({ type: 'ABILITY_SELECTED', ability });
  }
}