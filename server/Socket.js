import socketIo from 'socket.io';


class Socket {

  constructor(app, http, solicitation, process, serverManager) {
    var server = http.createServer(app);
    var io = socketIo(server);
    server.listen(8080, "127.0.0.1");
    this.io = io;
    this.processTimeouts = [];
    this.solicitation = solicitation;
    this.serverManager = serverManager;

    serverManager.setGeralEvents({
      receivedItem: (item) => {
        this.io.emit('receivedItem', item);
      },
      queueItem: (item) => {
        this.io.emit('queueItem', item);
      }
    });
    serverManager.setServerEvents({
      create: (servers) => {
        this.io.emit('createdServers', servers);
      },
      idle: (server) => {
        this.io.emit('serverIdle', server);
      },
      processingItem: (server, item) => {
        this.io.emit('serverProcessingItem', server, item);
      },
      processedItem: (server, item) => {
        this.io.emit('serverProcessedItem', server, item);
      }
    });
    serverManager.setMetricsEvents({
      updatedDelay: (metrics) => {
        this.io.emit('updatedDelay', metrics);
      },
      updatedArrival: (metrics) => {
        this.io.emit('updatedArrival', metrics);
      },
      updatedAverages: (metrics) => {
        this.io.emit('updatedAverages', metrics);
      },
      updatedServersStatus: (serversStatus) => {
        this.io.emit('updatedServersStatus', serversStatus);
      },
      mostDelayed: (timeMili) => {
        this.io.emit('mostDelayed', timeMili);
      },
      mostTimeInQueue: (timeMili) => {
        this.io.emit('mostTimeInQueue', timeMili);
      }
    });


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

      socket.emit('processing', this.serverManager.isProcessing());

      socket.on('start', (data) => {
        this.serverManager.stop();
        this.serverManager.start(data.servers);
        self.startProcessing(data);
      });

      socket.on('stop', () => {
        this.processTimeouts.map((timeOut) => clearTimeout(timeOut));
        this.serverManager.stop();
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }

  startProcessing(data) {
    var itens = this.solicitation.get();
    var arrivalSum = 0;

    this.processTimeouts.map((timeOut) => clearTimeout(timeOut));

    itens.map((item) => {
      arrivalSum += item.arrival;
      let arrival = arrivalSum;

      let timeOut = setTimeout(() => {
        this.serverManager.addItem(item);
      }, arrival * 1000);

      this.processTimeouts.push(timeOut);
    });
  }
}

export default Socket;
