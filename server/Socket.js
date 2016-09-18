import socketIo from 'socket.io';
import Process from './Process';

class Socket {

  constructor(app, http, solicitation) {
    var server = http.createServer(app);
    var io = socketIo(server);
    server.listen(8080, "127.0.0.1");
    this.io = io;
    this.solicitation = solicitation;
    this.process = new Process(io, {
      start: () => {

      },
      stop: () => {

      },
      receivedItem: (item) => {
        this.io.emit('receivedItem', item);
      },
      processItem: (item) => {
        this.io.emit('processItem', item);
      },
      completedItem: (item) => {
        this.io.emit('completedItem', item);
      },
      addQueueItem: (item) => {
        this.io.emit('addQueueItem', item);
      },
      removeQueueItem: (item) => {
        this.io.emit('removeQueueItem', item);
      }
    });
  }

  start() {
    var self = this;
    this.io.on('connection', (socket) => {
      console.log('a user connected');

      socket.emit('processing', this.process.isProcessing());

      socket.on('start', () => {
        this.io.emit('startServer');
        self.startProcessing();
      });

      socket.on('solicitations', () => {
        socket.emit('solicitations', self.solicitation.get());
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }

  startProcessing() {
    var itens = this.solicitation.get();
    var arrivalSum = 0;

    itens.map((item) => {
      arrivalSum += item.arrival;
      let arrival = arrivalSum;

      setTimeout(() => {
        this.process.addItem(item);
      }, arrival * 1000);
    });
  }
}

export default Socket;
