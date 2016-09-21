import Guid from 'guid';

class Server {
  constructor(number, events) {
    this.id = Guid.create();
    this.name = `Servidor ${number}`;
    this.processingItem = undefined;
    this.timeout = undefined;
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name
    }
  }

  getProcessingItem() {
    return this.processingItem;
  }

  cancel() {
    clearTimeout(this.timeout);
  }

  processItem(item, callback) {
    if (this.processingItem) throw new Error('Processing a item. Cannot process another.')
    this.processingItem = item;

    this.timeout = setTimeout(() => {
      let i = this.processingItem;
      this.processingItem = undefined;

      callback(i);
    }, item.delay * 1000);
  }

  isProcessing() {
    return this.processingItem != undefined;
  }
}

export default Server;
