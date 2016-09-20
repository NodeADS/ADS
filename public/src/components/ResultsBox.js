import React from 'react';
import { Collection, CollectionItem, Row, Col } from 'react-materialize';
import ResultServer from './ResultServer';
import ResultSolicitation from './ResultSolicitation';

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
              <ResultSolicitation socket={this.props.socket} />
            </Col>
            <Col s={6}>
              <ResultServer socket={this.props.socket} />
            </Col>
          </Row>
        </CollectionItem>
      </Collection>
    );
  }
}

export default ResultsBox;
