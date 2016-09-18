import React from 'react';
import SolicitationsQueue from './SolicitationsQueue';

class SolicitationBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SolicitationsQueue socket={this.props.socket} />
      </div>
    );
  }
}

export default SolicitationBox;
