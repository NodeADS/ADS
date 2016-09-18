import 'materialize-css';
import React from 'react';
import ServerBox from './ServerBox';
import SolicitationBox from './SolicitationBox';
import ParametersBox from './ParametersBox';
import ResultsBox from './ResultsBox';
import { Row, Col } from 'react-materialize';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Row>
          <Col s={6}>
            <ParametersBox socket={this.props.socket} />
          </Col>
        </Row>
        <hr/>
        <Row>
          <Col s={4}>
            <SolicitationBox socket={this.props.socket} />
          </Col>
          <Col s={4}>
            <ServerBox socket={this.props.socket} />
          </Col>
          <Col s={4}>
            <ResultsBox socket={this.props.socket} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
