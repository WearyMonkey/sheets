import * as React from 'react';
import * as styles from './sheet.css';
import * as PackeryFactory from 'react-packery-component';
import { MODULES } from 'components/modules/modules';
import { Ability, Character } from 'data/character';
import { Drawer } from "material-ui";
// import { AbilityPanel } from 'components/ability_panel/ability_panel';
import { Sheet, ModuleConfig } from 'data/sheet';
import { observer } from 'mobx-react';
import { AbilityPanel } from '../ability_panel/ability_panel';

export type SheetUiAction =
    { type: 'ABILITY_SELECTED', ability: Ability } |
    { type: 'STAT_SELECTED', statId: string }

export type SheetUiActionCallback = (action : SheetUiAction) => void

@observer
export class Sheets extends React.Component<{ sheet: Sheet, character: Character }, { selectedAbility?: Ability }> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    const { selectedAbility } = this.state;
    const { sheet, character } = this.props;
    const modules = sheet.modules.map((moduleConfig : ModuleConfig) => {
      const module = MODULES.get(moduleConfig.type);
      if (module) {
        const Module = module.component;
        return <Module moduleId={moduleConfig.id} state={moduleConfig.state} character={character} sheetUiAction={this.handleUiAction.bind(this)} />
      } else {
        return <div>Unknown module type {moduleConfig.type}</div>;
      }
    });
    return <SheetPresentation modules={modules} selectedAbility={selectedAbility} />
  }

  handleUiAction(action: SheetUiAction) {
    switch (action.type) {
      case 'ABILITY_SELECTED':
        this.setState({ selectedAbility: action.ability });
        break;
      case 'STAT_SELECTED': {

        break;
      }
    }
  }
}

function SheetPresentation({ modules, selectedAbility } : { modules: React.ReactElement<any>[], selectedAbility?: Ability }) {
  return <div className={styles.root}>
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
}

const Packery = PackeryFactory(React);

const packeryOptions = {
  itemSelector: '.' + styles.moduleContainer,
  columnWidth: '.' + styles.gridSizer,
  gutter: '.' + styles.gutterSizer,
  percentPosition: true
};