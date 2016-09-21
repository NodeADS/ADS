class Process {
  constructor(events = {}) {
    this.item;
    this.queue = [];
    this.processeds = [];
    this.itemMostDelayed;

    this.events = {
      start: () => {},
      stop: () => {},
      processItem: () => {},
      completedItem: () => {},
      addQueueItem: () => {},
      removeQueueItem: () => {},
      receivedItem: () => {},
      mostDelayed: (timeMili) => {}
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
    }, item.delay );
  }

  completedItem(item) {
    item.completeDate = Date.now();
    this.events.completedItem(item);
    this.processeds.push(item);
    this.mostDelayed(item);
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

  isProcessing() {
    return this.item != undefined || this.queue.length > 0;
  }

}

export default Process;
