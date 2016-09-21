import React from 'react';
import SolicitationsQueue from './SolicitationsQueue';
import SolicitationsCompleted from './SolicitationsCompleted';
import { Collapsible, CollapsibleItem } from 'react-materialize';

class SolicitationBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Collapsible>
        <SolicitationsQueue socket={this.props.socket} />
        <SolicitationsCompleted socket={this.props.socket} />
      </Collapsible>
    );
  }
}

export default SolicitationBox;
