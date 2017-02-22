import * as React from 'react';
import { Description } from 'data/character';
import TextField from 'material-ui/TextField';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import ChangeEvent = React.ChangeEvent;

@observer
export class DescriptionCard extends React.Component<{description: Description}, {}> {

  render() {
    const {description} = this.props;
    switch (description.type) {
      case 'IMAGE':
        return <img src={description.url}/>;
      case 'TEXT':
        return <TextField type="text" onChange={this.handleChange} value={description.value}/>
    }
  }

  @action
  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {description} = this.props;
    description.type = 'TEXT';
    if (description.type == 'TEXT') {
      description.value = event.currentTarget.value;
    }
  }
}