class API {
  constructor(app, serverManager) {
    this.serverManager = serverManager;
    this.app = app;
    this.gets();
  }

  gets() {
    this.app.get('/api/servers', (req, res) => {
      res.json(this.serverManager.servers.map((s) => {
        return s.getInfo();
      }));
    });

    this.app.get('/api/server/status', (req, res) => {
      var server;
      for (let i in this.serverManager.servers) {
        let temp = this.serverManager.servers[i];
        if (temp.id == req.query.id) {
          server = temp;
          break;
        }
      }

      res.json({
        item: server.getProcessingItem()
      });
    });

    this.app.get('/api/solicitations/processing', (req, res) => {
      let itens = [];
      for (let i in this.serverManager.servers) {
        let server = this.serverManager.servers[i];
        let item = server.getProcessingItem();
        if (item) {
          itens = itens.concat(item);
        }
      }
      itens = itens.concat(this.serverManager.queue);
      
      res.json(itens);
    });

    this.app.get('/api/solicitations/completed', (req, res) => {
      res.json(this.serverManager.processeds);
    });

  /*  this.app.get('/api/metrics/delay', (req, res) => {
      res.json(this.processManager.getMetricsDelay());
    });

    this.app.get('/api/metrics/arrival', (req, res) => {
      res.json(this.processManager.getMetricsArrival());
    });*/
  }
}

export default API;
