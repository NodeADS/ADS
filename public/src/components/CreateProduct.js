import React from 'react';
import { Button, Row, Input } from 'react-materialize';

class CreateProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Produto 1',
      time: 10000
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeTime = this.handleChangeTime.bind(this);
  }

  componentDidMount() {

  }

  handleChangeName(event) {
    this.setState({name: event.target.value.substr(0, 25)});
  }

  handleChangeTime(event) {
    this.setState({time: event.target.value});
  }

  onSubmit(e) {
    e.preventDefault();

    if (!this.state.name.length) {
      alert('Digite um nome para o produto');
      return;
    } else if (this.state.time <= 0) {
      alert('Digite o tempo de processamento do produto');
      return;
    }
    this.props.socket.emit('addProduct', {
      name: this.state.name,
      time: this.state.time
    });

  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <Row>
          <Input s={12} label="Nome"
            value={this.state.name}
            onChange={this.handleChangeName} />
          <Input s={12} label="Tempo de processamento (ms)"
            value={this.state.time}
            onChange={this.handleChangeTime}/>
        </Row>
         <Button waves='light' type='submit'>Adicionar</Button>
      </form>
    );
  }
}

export default CreateProduct;
