import Guid from 'guid';

class Server {
  constructor(number, events) {
    this.id = Guid.create();
    this.name = `Servidor ${number}`;
    this.processingItem;

    this.events = {
      completedItem: (server, item) => {}
    }
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name
    }
  }

  processItem(item) {
    if (this.processItem) throw new Error('Processing a item. Cannot process another.')
    this.processingItem = item;

    setTimeout(() => {
      let i = this.processingItem;
      this.processingItem = undefined;

      this.events.completedItem(i);
    }, item.delay * 1000);
  }

  isProcessing() {
    return this.item != undefined;
  }
}

export default Server;
