import * as React from 'react';
import * as styles from './sheet.css';
import * as PackeryFactory from 'react-packery-component';
import { MODULES } from 'components/modules/modules';
import { Character } from 'data/character';
import { Drawer } from "material-ui";
import { Sheet, ModuleConfig } from 'data/sheet';
import { observer } from 'mobx-react';
import { AbilityPanel } from '../ability_panel/ability_panel';
import { AppState } from '../../data/app_state';
import { StatPanel } from '../stat_panel/stat_panel';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { action } from 'mobx';


@observer
export class Sheets extends React.Component<{ appState: AppState, sheet: Sheet, character: Character }, {}> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    const { sheet, character, appState } = this.props;
    const { selectedAbility, selectedStatId, onStatIdChange } = appState;
    const modules = sheet.modules.map((moduleConfig : ModuleConfig) => {
      const module = MODULES.get(moduleConfig.type);
      if (module) {
        const Module = module.component;
        return <Module moduleId={moduleConfig.id} state={moduleConfig.state} character={character} appState={appState} onDelete={() => {}} />
      } else {
        return <div>Unknown module type {moduleConfig.type}</div>;
      }
    });
    return (<div className={styles.root}>
          <Drawer width={200} openSecondary={false} open={selectedStatId != null}>
            {selectedStatId != null &&
              <StatPanel statId={selectedStatId} character={character} onStatIdChange={onStatIdChange} />
            }
          </Drawer>
          <IconMenu
              iconButtonElement={ <RaisedButton label="Add Module" /> }
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          >
            <MenuItem primaryText="Grid" onClick={this.onAddGrid} />
            <MenuItem primaryText="List" onClick={this.onAddList} />
          </IconMenu>
          <Packery options={packeryOptions} className="sheets">
            <div className={styles.gutterSizer}></div>
            <div className={styles.gridSizer}></div>
            {modules.map((m, id) => {
              return <div className={styles.moduleContainer} key={id}>
                {m}
              </div>
            })}
          </Packery>
          <Drawer width={200} openSecondary={true} open={selectedAbility != null}>
            {selectedAbility != null &&
            <AbilityPanel ability={selectedAbility} />
            }
          </Drawer>
        </div>
    );
  }

  @action
  onAddList = () => {
    this.props.sheet.modules.push({ id: this.props.sheet.modules.length, state: { title: '' }, type: 'ABILITIES_MODULE' });
  };

  @action
  onAddGrid = () => {
    this.props.sheet.modules.push({ id: this.props.sheet.modules.length, state: { title: '', rows: [], columns: [] }, type: 'GRID_MODULE' });
  };
}

const Packery = PackeryFactory(React);

const packeryOptions = {
  itemSelector: '.' + styles.moduleContainer,
  columnWidth: '.' + styles.gridSizer,
  gutter: '.' + styles.gutterSizer,
  percentPosition: true
};