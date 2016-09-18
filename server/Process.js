class Process {
  constructor(ioSocket, events) {
    this.io = ioSocket;
    this.item;
    this.queue = [];

    this.events = {
      start: () => {},
      stop: () => {},
      processItem: () => {},
      completedItem: () => {},
      addQueueItem: () => {},
      removeQueueItem: () => {},
      receivedItem: () => {}
    };

    this.events = Object.assign(this.events, events);

    this.start();
  }

  start() {

  }

  stop() {

  }

  addItem(item) {
    this.events.receivedItem(item);
    //console.log('addItem', this.item, this.queue);
    //console.log('');
    if (this.item) {
      this.events.addQueueItem(item);
      this.queue.push(item);
    } else {
      this.item = item;
      this.process(item);
    }
  }

  process(item) {
    //console.log('process', this.item, this.queue);
    //console.log('');
    this.events.processItem(item);
    setTimeout(() => {
      this.events.completedItem(item);
      this.goNext();
    }, item.delay * 1000);
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
