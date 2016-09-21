class API {
  constructor(app, processManager) {
    this.processManager = processManager;
    this.app = app;
    this.gets();
  }

  gets() {
    this.app.get('/api/metrics/delay', (req, res) => {
      res.json(this.processManager.getMetricsDelay());
    });

    this.app.get('/api/metrics/arrival', (req, res) => {
      res.json(this.processManager.getMetricsArrival());
    });
  }
}

export default API;
