import Server from './Server';

class ServerManager {
  constructor() {
    this.servers = [];
    this.queue = [];

    this.geralEvents = {
      queueItem: (item) => {},
      mostDelayed: (timeMili) => {},
      mostTimeInQueue: (timeMili) => {}
    };

    this.serverEvents = {
        idle: (server) => {},
        receivedItem: (server, item) => {},
        processingItem: (server, item) => {},
        completedItem: (server, item) => {}
    };

    this.metricsEvents = {
        updatedTimeInQueue: (metrics) => {},
        updatedProcessingTime: (metrics) => {},
        updatedAverages: (metrics) => {}
    };
  }

  setGeralEvents(events: {}) {
    this.geralEvents = Object.assign(this.geralEvents, events);
  }

  setServerEvents(events: {}) {
    this.serverEvents = Object.assign(this.serverEvents, events);
  }

  setMetricsEvents(events: {}) {
    this.metricsEvents = Object.assign(this.metricsEvents, events);
  }

  start(numberServer: 1) {
    for (var i = 0; i < numberServer; i++) {
      this.servers.push(
        new Server((i + 1), {
          completedItem: (server, item) => {this.completedItem(server, item)}
        })
      );
    }
  }

  stop() {
    for (let i in this.servers) {
      let server = this.servers[i];
      server.cancel();
    }

    this.servers = [];
    this.queue = [];
  }

  addItem(item) {
    let processingItem = false;

    item.receiveDate = Date.now();

    for (let i in this.servers) {
      let server = this.servers[i];

      if (!server.isProcessing()) {
        this.process(server, item);
        processingItem = true;
      }
    }

    if (!processingItem) {
      this.addQueue();
    }
  }

  completedItem(server, item) {
    this.events.server.completedItem(server, item);
    if (this.queue.length) {
      let newItem = this.queue.shift();
      this.processItem(server, newItem);

    } else {
      this.events.server.idle(server);

    }
  }

  processItem(server, item) {
    this.events.server.processingItem(server, item);
    server.processItem(item);

  }

  addQueue(item) {
    this.queue.push(item);
  }

}

export default ServerManager;
