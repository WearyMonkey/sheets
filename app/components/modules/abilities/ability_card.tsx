import * as React from 'react';
import { Ability, Description } from 'data/character';
import { Store } from 'data/store';
import { DescriptionCard } from 'components/description_card/description_card';
import { SheetUiActionCallback } from '../../sheet/sheet';

export class AbilityCard extends React.Component<{ abilityStore: Store<Ability>, sheetUiAction: SheetUiActionCallback }, {}> {
  render() {
    const { abilityStore } = this.props;
    return <div onClick={this.handleClick.bind(this)}>
      <DescriptionCard descriptionStore={abilityStore.lens<Description>({
        get: ability => ability.description,
        set: (ability, description) => ({ ...ability, description })
      })} />
    </div>
  }

  private handleClick() {
    const { abilityStore, sheetUiAction } = this.props;
    sheetUiAction({ type: 'ABILITY_SELECTED', abilityStore });
  }
}