import socketIo from 'socket.io';


class Socket {

  constructor(app, http, solicitation, process, serverManager) {
    var server = http.createServer(app);
    var io = socketIo(server);
    server.listen(8080, "127.0.0.1");
    this.io = io;
    this.processTimeouts = [];
    this.solicitation = solicitation;
    this.process = process
    this.serverManager = serverManager;

    

    process.setEvents({
      start: () => {
        this.io.emit('startServer');
      },
      stop: () => {
        this.io.emit('stopServer');
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
      },
      mostDelayed: (miliseconds) => {
        this.io.emit('mostDelayed', miliseconds);
      },
      recalculateMetricsDelay: (metrics) => {
        this.io.emit('recalculateMetricsDelay', metrics);
      },
      recalculateMetricsArrival: (metrics) => {
        this.io.emit('recalculateMetricsArrival', metrics);
      },
      mostTimeInQueue: (miliseconds) => {
        this.io.emit('mostTimeInQueue', miliseconds);
      },
      recalculateMetricsAvg: (metrics) => {
        this.io.emit('recalculateMetricsAvg', metrics);
      }

    });
  }

  start() {
    var self = this;
    this.io.on('connection', (socket) => {
      console.log('a user connected');

      socket.emit('processing', this.process.isProcessing());

      socket.on('start', (data) => {
        this.process.start();
        self.startProcessing(data);
      });

      socket.on('stop', () => {
        this.process.stop();
      });

      socket.on('serverStatus', () => {
        socket.emit('serverStatus', {
          on: this.process.isStarted(),
          processing: this.process.isProcessing(),
          processingItem: this.process.getProcessingItem()
        });
      });

      socket.on('solicitationsQueue', () => {
        socket.emit('solicitationsQueue', self.process.getQueue());
      });

      socket.on('solicitationsProcesseds', () => {
        socket.emit('solicitationsProcesseds', self.process.getProcesseds());
      });

      socket.on('solicitationsProcessing', () => {
        socket.emit('solicitationsProcessing', self.process.getProcessingItem());
      });

      socket.on('solicitations', () => {
        socket.emit('solicitations', self.solicitation.get());
      });

      socket.on('resultSolicitation', () => {
        socket.emit('resultSolicitation', {
          total: self.process.getTotal(),
          average: 0,
          mode: 0,
          variance: 0,
          deviation: 0
        });
      });

      socket.on('resultServer', () => {
        socket.emit('resultServer', {
          total: self.process.getProcesseds().length,
          average: 0,
          mode: 0,
          variance: 0,
          deviation: 0
        });
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }

  startProcessing(data) {
    var itens = this.solicitation.get();
    var arrivalSum = 0;
    var time = data.time == 's' ? 1 : 60;

    this.processTimeouts.map((timeOut) => clearTimeout(timeOut));
    this.process.reset();

    itens.map((item) => {
      arrivalSum += item.arrival;
      let arrival = arrivalSum;

      let timeOut = setTimeout(() => {
        this.process.addItem(item);
      }, arrival * time * 1000);

      this.processTimeouts.push(timeOut);
    });
  }
}

export default Socket;
