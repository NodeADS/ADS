import React from 'react';
import countdown from 'countdown';
import { Button } from 'react-materialize';

countdown.setLabels(
	' milissegundo| segundo| minuto| hora| dia| semana| mês| ano| década| século| milênio',
	' milissegundos| segundos| minutos| horas| dias| semanas| meses| anos| décadas| séculos| milênios',
	' e ',
	' + ',
	'agora');

class SolicitationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.completed ? 'Completo' : 'Parado',
      collor: this.props.completed ? 'green-text' : 'red-text',
      queue: false,
      timeOnQueue: ''
    };
  }

  componentDidMount() {
    this.interval = undefined;
    if (this.props.socket) {
      this.setupSocket();

      //processando
      if (this.props.solicitation.startDate != undefined) {
        this.setState({
          status: 'Processando...',
          collor: 'orange-text',
          queue: false
        });

      } else if (this.props.solicitation.queueDate != undefined) {
        let intervalTime = 1000
           , initDate = new Date(this.props.solicitation.queueDate);

         this.setState({
           queue: true
         });

        this.interval = setInterval(() => {
          this.setState({ timeOnQueue: countdown(initDate, new Date()).toString() });
        }, intervalTime);
      }
    }
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  setupSocket() {
    this.props.socket.on('processItem', (item) => {
      if (item.id != this.props.solicitation.id) return;


      this.setState({
        status: 'Processando...',
        collor: 'orange-text',
        queue: false
      });
    });

    /*
    this.props.socket.on('completedItem', (item) => {
      if (item.id != this.props.solicitation.id) return;
      this.setState({
        status: 'Completo',
        collor: 'green-text',
        processing: false
      });
      //clearInterval(this.interval);
    });
    */

    this.props.socket.on('addQueueItem', (item) => {
      if (item.id != this.props.solicitation.id) return;
      let intervalTime = 1000
         , val = 0;

      this.setState({
        status: 'Parado',
        collor: 'red-text',
        queue: true,
        timeOnQueue: '',
        timeOnQueue: countdown(0, val).toString()
      });

      this.interval = setInterval(() => {
        val += intervalTime;
        this.setState({ timeOnQueue: countdown(0, val).toString() });
      }, intervalTime);
    });

    this.props.socket.on('removeQueueItem', (item) => {
      if (item.id != this.props.solicitation.id) return;
      this.setState({
        status: 'Parado',
        collor: 'orange-text',
        queue: false
      });
    });
  }

  render() {
    return (
      <div>
        <div>
          {this.props.solicitation.name}
          <span className={(this.state.queue ? '' : 'hide') + ' right'}>{`Tempo na fila: ${this.state.timeOnQueue}`}</span>
        </div>
        <div className='clearfix' />
        <span className={this.state.collor + ' small'}>{this.state.status}</span>
      </div>
    );
  }
}

export default SolicitationItem;
