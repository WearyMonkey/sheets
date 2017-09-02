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
import { StatPanel } from '../stat_panel/stat_panel';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { action } from 'mobx';

type Props = {
  appState: AppState,
  sheet: Sheet,
  character: Character
};

@observer
export class Sheets extends React.Component<Props, {}> {

  render() {
    const { sheet, character, appState } = this.props;
    const { selectedAbility, selectedStatId, onStatIdChange } = appState;
    return (
      <div className={styles.root}>
        <Drawer width={200} openSecondary={false} open={selectedStatId != null}>
          {selectedStatId &&
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
          <div className={styles.gutterSizer} />
          <div className={styles.gridSizer} />
          {sheet.modules.map(moduleConfig => {
            return <div className={styles.moduleContainer} key={moduleConfig.id}>
              {this.renderModule(moduleConfig, character, appState)}
            </div>
          })}
        </Packery>
        <Drawer width={200} openSecondary={true} open={selectedAbility != null}>
          {selectedAbility &&
            <AbilityPanel ability={selectedAbility} onDelete={this.onDeleteAbility} />
          }
        </Drawer>
      </div>
    );
  }

  private renderModule(moduleConfig: ModuleConfig, character: Character, appState: AppState) {
    const module = MODULES.get(moduleConfig.type);
    if (module) {
      return (
        <module.Component
          moduleId={moduleConfig.id}
          state={moduleConfig.state}
          character={character}
          appState={appState}
          onDelete={this.onDeleteModule} />
      );
    } else {
      return <div>Unknown module type {moduleConfig.type}</div>;
    }
  }

  @action
  private readonly onDeleteAbility = (ability: Ability) => {
    const index = this.props.character.abilities.indexOf(ability);
    this.props.character.abilities.splice(index, 1);
    if (ability === this.props.appState.selectedAbility) {
      this.props.appState.selectedAbility = undefined;
    }
  };

  @action
  private readonly onDeleteModule = (moduleId: number) => {
    const index = this.props.sheet.modules.findIndex(m => m.id === moduleId);
    this.props.sheet.modules.splice(index, 1);
  };

  @action
  private readonly onAddList = () => {
    this.props.sheet.modules.push({ id: this.props.sheet.modules.length, state: { title: '' }, type: 'ABILITIES_MODULE' });
  };

  @action
  private readonly onAddGrid = () => {
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