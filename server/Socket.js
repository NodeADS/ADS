import socketIo from 'socket.io';

class Socket {
  constructor(app, http, solicitation) {
    var server = http.createServer(app);
    var io = socketIo(server);
    server.listen(8080, "127.0.0.1");
    this.io = io;
    this.solicitation = solicitation;
  }

  start() {
    var self = this;
    this.io.on('connection', (socket) => {
      console.log('a user connected');

      socket.on('addSolicitation', (newProduct) => {

      });

      socket.on('removeSolicitation', () => {
      });

      socket.on('solicitations', () => {
        socket.emit('solicitations', self.solicitation.get());
      });

      socket.on('processSolicitation', (id) => {
        var p = getProduct(id);

        if (p) {
          io.emit('processingSolicitation', p);

          setTimeout(function() {
            io.emit('solicitationProcessed', p);
          }, p.time)
        }
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }
}

export default Socket;
