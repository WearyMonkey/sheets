import * as React from 'react';
import * as styles from './sheet.css';
import * as PackeryFactory from 'react-packery-component';
import { MODULES } from 'components/modules/modules';
import { Ability, Character } from 'data/character';
import { Drawer } from "material-ui";
import { Sheet, ModuleConfig } from 'data/sheet';
import { observer } from 'mobx-react';
import { AbilityPanel } from '../ability_panel/ability_panel';
import { AppState } from '../../data/app_state';
import { StatField } from '../stat_field/stat_field';
import { StatPanel } from '../stat_panel/stat_panel';

@observer
export class Sheets extends React.Component<{ appState: AppState, sheet: Sheet, character: Character }, {}> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    const { sheet, character, appState } = this.props;
    const { selectedAbility, selectedStat } = appState;
    const modules = sheet.modules.map((moduleConfig : ModuleConfig) => {
      const module = MODULES.get(moduleConfig.type);
      if (module) {
        const Module = module.component;
        return <Module moduleId={moduleConfig.id} state={moduleConfig.state} character={character} appState={appState} />
      } else {
        return <div>Unknown module type {moduleConfig.type}</div>;
      }
    });
    return (<div className={styles.root}>
          <Drawer width={200} openSecondary={false} open={!!selectedStat}>
            {!!selectedStat &&
              <StatPanel stat={selectedStat} character={character} />
            }
          </Drawer>
          <Packery options={packeryOptions} className="sheets">
            <div className={styles.gutterSizer}></div>
            <div className={styles.gridSizer}></div>
            {modules.map((m, id) => {
              return <div className={styles.moduleContainer} key={id}>
                {m}
              </div>
            })}
          </Packery>
          <Drawer width={200} openSecondary={true} open={!!selectedAbility}>
            {!!selectedAbility &&
            <AbilityPanel ability={selectedAbility} />
            }
          </Drawer>
        </div>
    );
  }
}

const Packery = PackeryFactory(React);

const packeryOptions = {
  itemSelector: '.' + styles.moduleContainer,
  columnWidth: '.' + styles.gridSizer,
  gutter: '.' + styles.gutterSizer,
  percentPosition: true
};