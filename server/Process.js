class Process {
  constructor(events = {}) {
    this.item;
    this.queue = [];
    this.processeds = [];
    this.itemMostDelayed;
    this.metrics = {
      average: 0,
      mode: 0,
      variance: 0,
      deviation: 0,
      processeds: 0,
      queue: 0
    };

    this.events = {
      start: () => {},
      stop: () => {},
      processItem: () => {},
      completedItem: () => {},
      addQueueItem: () => {},
      removeQueueItem: () => {},
      receivedItem: () => {},
      mostDelayed: (timeMili) => {},
      recalculateMetrics: () => {}
    };

    this.start();
  }

  setEvents(events = {}) {
    this.events = Object.assign(this.events, events);
  }

  isStarted() {
    return true;
  }

  getQueue() {
    return this.queue;
  }

  getProcessingItem() {
    return this.item;
  }

  getProcesseds() {
    return this.processeds;
  }

  getMetrics() {
    return this.metrics;
  }

  getTotal() {
    return this.processeds.length + this.queue.length + (this.item ? 1 : 0);
  }

  reset() {
    this.item = undefined;
    this.queue = [];
    this.processeds = [];
  }

  start() {

  }

  stop() {

  }



  addItem(item) {
    item.receiveDate = Date.now();
    this.events.receivedItem(item);
    //console.log('addItem', this.item, this.queue);
    //console.log('');
    if (this.item) {
      this.addQueue(item);
    } else {
      this.process(item);
    }
  }

  addQueue(item) {
    item.queueDate = Date.now();
    this.events.addQueueItem(item);
    this.queue.push(item);
  }

  process(item) {
    this.item = item;
    //console.log('process', this.item, this.queue);
    //console.log('');
    item.startDate = Date.now();
    this.events.processItem(item);
    setTimeout(() => {
      this.completedItem(item);
      this.goNext();
    }, item.delay * 1000);
  }

  completedItem(item) {
    item.completeDate = Date.now();
    this.events.completedItem(item);
    this.processeds.push(item);
    this.mostDelayed(item);
    this.recalculateMetrics();
  }

  mostDelayed(item) {
    if (this.itemMostDelayed) {
      this.itemMostDelayed = item.delay > this.itemMostDelayed.delay ? item : this.itemMostDelayed;
    } else {
      this.itemMostDelayed = item;
    }
    this.events.mostDelayed(this.itemMostDelayed.delay * 1000);
  }

  goNext() {
    if (this.queue.length) {
      var item = this.queue.shift();
      this.events.removeQueueItem(item);
      this.process(item);
    } else {
      this.item = undefined;
    }
  }

  recalculateMetrics() {
    let itens = this.processeds.map((i) => i.delay);

    this.metrics.average = this.getAverage(itens);
    this.metrics.mode = this.getMode(itens);
    this.metrics.variance = this.getVariance(itens, this.metrics.average);
    this.metrics.deviation = this.getDeviation(this.metrics.variance);
    this.metrics.processeds = this.processeds.length;
    this.metrics.queue = this.queue.length;

    this.events.recalculateMetrics(this.metrics);
  }

  getAverage(itens) {
    return itens.reduce((p, c) => p + c, 0) / itens.length;
  }

  getMode(itens) {
    let dict = {}
      , greatestFreq = -1
      , mode;

    itens.map((item) => {
      if (dict[item]) {
        dict[item] = dict[item] + 1;
      } else {
        dict[item] = 1;
      }
    });

    for(let key in dict) {
      if(dict[key] > greatestFreq){
          greatestFreq = dict[key];
          mode = key;
      }
    }

    return parseInt(mode);
  }

  getVariance(itens, average) {
    return itens.reduce((p, c) => {
      return p + Math.pow(c - average, 2);
    }, 0) / itens.length;
  }

  getDeviation(variance) {
    let deviation = Math.sqrt(variance);
    if (deviation < 0) {
      deviation = deviation * -1;
    }
    return deviation;
  }

  isProcessing() {
    return this.item != undefined || this.queue.length > 0;
  }

}

export default Process;
