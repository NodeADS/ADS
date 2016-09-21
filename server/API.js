class API {
  constructor(app, processManager) {
    this.processManager = processManager;
    this.app = app;
    this.gets();
  }

  gets() {
    this.app.get('/api/metrics', (req, res) => {
      res.json(this.processManager.getMetrics());
    });
  }
}

export default API;
