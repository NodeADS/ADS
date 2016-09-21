import React from 'react';
import { Collection, CollectionItem, Row, Col } from 'react-materialize';
import ResultDelay from './ResultDelay';
import ResultArrival from './ResultArrival';

class ResultsBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Collection header='Resultados'>
        <CollectionItem>
          <Row>
            <Col s={6}>
              <ResultArrival socket={this.props.socket} />
            </Col>
            <Col s={6}>
              <ResultDelay socket={this.props.socket} />
            </Col>
          </Row>
        </CollectionItem>
      </Collection>
    );
  }
}

export default ResultsBox;
