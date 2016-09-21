import Server from './Server';

class ServerManager {
  constructor() {
    this.servers = [];
    this.queue = [];
    this.itemMostDelayed;
    this.itemMostTimeInQueue;

    this.geralEvents = {
      receivedItem: (item) => {},
      queueItem: (item) => {},
      mostDelayed: (timeMili) => {},
      mostTimeInQueue: (timeMili) => {}
    };

    this.serverEvents = {
      create: (servers) => {},
      idle: (server) => {},
      processingItem: (server, item) => {},
      processedItem: (server, item) => {}
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
        new Server(i + 1)
      );
    }
    this.serverEvents.create(this.servers);
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
    this.geralEvents.receivedItem(item);

    for (let i in this.servers) {
      let server = this.servers[i];

      if (!server.isProcessing()) {
        this.processItem(server, item);
        processingItem = true;
        break;
      }
    }

    if (!processingItem) {
      this.addQueue(item);
    }
  }

  goNext(server) {
    if (this.queue.length) {
      let newItem = this.queue.shift();
      this.processItem(server, newItem);

    } else {
      this.serverEvents.idle(server);

    }
  }

  processItem(server, item) {
    item.startDate = Date.now();
    item.timeInQueue = item.startDate - item.receiveDate;
    this.serverEvents.processingItem(server, item);
    this.updateMostTimeInQueue(item);

    server.processItem(item, (_) => {
      item.completeDate = Date.now();
      item.timeToComplete = item.completeDate - item.receiveDate;
      this.serverEvents.processedItem(server, item);
      this.updateMostDelayed(item);

      this.goNext(server)
    });
  }

  addQueue(item) {
    item.queueDate = Date.now();
    this.queue.push(item);
    this.geralEvents.queueItem(item);
  }

  updateMostDelayed(item) {
    if (this.itemMostDelayed) {
      this.itemMostDelayed = item.timeToComplete > this.itemMostDelayed.timeToComplete ? item : this.itemMostDelayed;
    } else {
      this.itemMostDelayed = item;
    }
    this.geralEvents.mostDelayed(this.itemMostDelayed.timeToComplete);
  }

  updateMostTimeInQueue(item) {
    if (this.itemMostTimeInQueue) {
      this.itemMostTimeInQueue = item.timeInQueue > this.itemMostTimeInQueue.timeInQueue ? item : this.itemMostTimeInQueue;
    } else {
      this.itemMostTimeInQueue = item;
    }
    this.geralEvents.mostTimeInQueue(this.itemMostTimeInQueue.timeInQueue);
  }

}

export default ServerManager;
