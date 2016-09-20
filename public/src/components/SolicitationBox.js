import React from 'react';
import SolicitationsQueue from './SolicitationsQueue';
import SolicitationsCompleted from './SolicitationsCompleted';

class SolicitationBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SolicitationsQueue socket={this.props.socket} />
        <SolicitationsCompleted socket={this.props.socket} />
      </div>
    );
  }
}

export default SolicitationBox;
