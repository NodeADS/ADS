import Server from './Server';
import Calc from './Calc';

class ServerManager {
  constructor() {
    this.servers = [];
    this.queue = [];
    this.processeds = [];
    this.metrics = {
      delay: this.getDefaultMetric(),
      arrival: this.getDefaultMetric()
    };
    this.itemMostDelayed;
    this.itemMostTimeInQueue;
    this.intervalServersStatus;

    this.geralEvents = {
      receivedItem: (item) => {},
      queueItem: (item) => {}
    };

    this.serverEvents = {
      create: (servers) => {},
      idle: (server) => {},
      processingItem: (server, item) => {},
      processedItem: (server, item) => {}
    };

    this.metricsEvents = {
      updatedDelay: (metrics) => {},
      updatedArrival: (metrics) => {},
      updatedAverages: (metrics) => {},
      updatedServersStatus: (serversStatus) => {},
      mostDelayed: (timeMili) => {},
      mostTimeInQueue: (timeMili) => {}
    };
  }

  getDefaultMetric() {
    return {
      total: 0,
      average: 0,
      mode: 0,
      variance: 0,
      deviation: 0,
      median: 0
    }
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

    clearInterval(this.intervalServersStatus);
    this.intervalServersStatus = setInterval(() => {
      this.metricsEvents.updatedServersStatus(
        this.servers.map((server) => server.getStatus())
      );
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalServersStatus);
    for (let i in this.servers) {
      let server = this.servers[i];
      server.cancel();
    }

    this.servers = [];
    this.queue = [];
    this.processeds = [];
    this.metrics = {
      delay: this.getDefaultMetric(),
      arrival: this.getDefaultMetric()
    };
  }

  isProcessing() {
    for (let i in this.server) {
      let server = this.server[i];
      if (server.isProcessing()) return true;
    }

    return false;
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
    this.updatedArrivalMetric();
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
      this.processeds.push(item);
      this.serverEvents.processedItem(server, item);
      this.updateMostDelayed(item);
      this.updatedDelayMetric();

      this.goNext(server)
    });
  }

  addQueue(item) {
    item.queueDate = Date.now();
    this.queue.push(item);
    this.geralEvents.queueItem(item);
  }

  calculateMetrics(itens) {
    let obj = {};

    obj.total = itens.length;
    obj.average = Calc.getAverage(itens);
    obj.mode = Calc.getMode(itens);
    obj.variance = Calc.getVariance(itens, obj.average);
    obj.deviation = Calc.getDeviation(obj.variance);
    obj.median = Calc.getMedian(itens);

    return obj;
  }

  updatedDelayMetric() {
    let itens = this.processeds;
    let obj = this.calculateMetrics(
      itens.map((item) => {
        return (item.startDate - item.receiveDate) / 1000;
      })
    );

    this.metrics.delay = obj;
    this.metricsEvents.updatedDelay(obj);
  }

  updatedArrivalMetric() {
    let itens = this.processeds.concat(this.queue);
    for (let i in this.servers) {
      let server = this.servers[i];
      let item = server.getProcessingItem();
      if (item) {
        itens = itens.concat(item);
      }
    }

    let obj = this.calculateMetrics(
      itens.map((item) => item.arrival)
    );

    this.metrics.arrival = obj;
    this.metricsEvents.updatedArrival(obj);
  }

  updatedAveragesMetric() {
    this.metricsEvents.updatedAverages({
      toConclude: 0,
      inQueue: 0
    });
  }

  updateMostDelayed(item) {
    if (this.itemMostDelayed) {
      this.itemMostDelayed = item.timeToComplete > this.itemMostDelayed.timeToComplete ? item : this.itemMostDelayed;
    } else {
      this.itemMostDelayed = item;
    }
    this.metricsEvents.mostDelayed(this.itemMostDelayed.timeToComplete);
  }

  updateMostTimeInQueue(item) {
    if (this.itemMostTimeInQueue) {
      this.itemMostTimeInQueue = item.timeInQueue > this.itemMostTimeInQueue.timeInQueue ? item : this.itemMostTimeInQueue;
    } else {
      this.itemMostTimeInQueue = item;
    }
    this.metricsEvents.mostTimeInQueue(this.itemMostTimeInQueue.timeInQueue);
  }

}

export default ServerManager;
