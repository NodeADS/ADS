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
      deviation: 0
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
    var itens = this.processeds.map((i) => i.delay);

    this.metrics.average = getAverage(itens);
    this.metrics.mode = getMode(itens);
    this.metrics.variance = getVariance(itens);
    this.metrics.deviation = getDeviation(itens);;

    this.events.recalculateMetrics(this.metrics);
  }

  getAverage(itens) {
    return itens.reduce((p, c) => p + c, 0) / itens.length;
  }

  getMode(itens) {
    let temp = {};
    itens.map((item) => {
      if (temp.item) temp.item++;
      else temp.item = 0;
    });
  }

  getVariance(itens) {
    return itens.reduce((p, c) => p + c, 0) / itens.length;
  }

  getDeviation(itens) {
    return itens.reduce((p, c) => p + c, 0) / itens.length;
  }

  isProcessing() {
    return this.item != undefined || this.queue.length > 0;
  }

}

export default Process;
