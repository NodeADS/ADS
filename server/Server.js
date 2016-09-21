import Guid from 'guid';

class Server {
  constructor(number, events) {
    this.id = Guid.create();
    this.name = `Servidor ${number}`;
    this.processingItem = undefined;
    this.timeout = undefined;
    this.created = Date.now();

    this.idleTime = 0;
    this.processingTime = 0;
    this.maxIdleTime = 0;
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name
    }
  }

  getStatus() {
    return {
      processingTime: this.processingTime,
      idleTime: this.idleTime,
      maxIdleTime: this.maxIdleTime
    };
  }

  getProcessingItem() {
    return this.processingItem;
  }

  cancel() {
    clearTimeout(this.timeout);
  }

  processItem(item, callback) {
    if (this.processingItem) throw new Error('Processing a item. Cannot process another.')
    let lastStop = this.stopTime || this.created
      , newIdle;

    this.processingItem = item;
    this.startTime = Date.now();
    newIdle = this.startTime - lastStop
    this.maxIdleTime = newIdle > this.maxIdleTime ? newIdle : this.maxIdleTime;
    this.idleTime += newIdle;

    this.timeout = setTimeout(() => {
      let i = this.processingItem;
      this.processingItem = undefined;
      this.stopTime = Date.now();
      this.processingTime += this.stopTime - this.startTime;

      callback(i);
    }, item.delay * 1000);
  }

  isProcessing() {
    return this.processingItem != undefined;
  }
}

export default Server;
