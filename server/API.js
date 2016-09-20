class API {
  constructor(app, processManager) {
    this.processManager = processManager;
    this.app = app;
    this.gets();
  }

  gets() {
    this.app.get('/api/products', (req, res) => {
      res.json({
        name: 'Felipe Nolleto'
      });
    });
  }
}

export default API;
