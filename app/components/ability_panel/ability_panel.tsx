import * as React from 'react';
import { Store } from 'data/store';
import { Ability, Action, Description } from 'data/character';
import { DescriptionCard } from 'components/description_card/description_card';
import { ActionCard } from './action_card/action_card';

export class AbilityPanel extends React.Component<{ abilityStore: Store<Ability> }, {}>{
  render() {
    const { abilityStore } = this.props;
    const ability = abilityStore.get();
    return <div>
      <DescriptionCard descriptionStore={ abilityStore.lens<Description>({
        get: ability => ability.description,
        set: (ability, description) => ({...ability, description})
      }) } />
      <div>
        {ability.actions.map((action, i) => {
          const actionStore = abilityStore.lens<Action>({
            get: ability => ability.actions.get(i),
            set: (ability, action) => ({...ability, actions: ability.actions.set(i, action)})
          });
          return <ActionCard key={action.moduleId} actionStore={actionStore} />
        })}
      </div>
    </div>
  }
}