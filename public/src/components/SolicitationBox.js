import React from 'react';
import SolicitationsQueue from './SolicitationsQueue';

class SolicitationBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SolicitationsQueue />
      </div>
    );
  }
}

export default SolicitationBox;
