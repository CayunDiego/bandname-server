const BandList = require('./band-list');

class Sockets {

  constructor( io ) {
    this.io = io;

    this.bandList = new BandList();

    this.socketEvents();
  }

  socketEvents() {
    //On connection
    this.io.on('connection', ( socket ) => {
      console.log('Cliente conectado');

      // Emitir al cliente conectado, todas las bandas actuales
      socket.emit('current-bands', this.bandList.getBands());

      //votar por la banda
      socket.on('vote-band', id => {
        this.bandList.incrementsVotes( id )
        this.io.emit('current-bands', this.bandList.getBands());
      })

      //borrar por la banda
      socket.on('delete-band', id => {
        this.bandList.removeBand( id )
        this.io.emit('current-bands', this.bandList.getBands());
      })

      //cambiar nombre de la banda
      socket.on('change-name-band', (data) => {
        this.bandList.changeName( data.id, data.name )
        this.io.emit('current-bands', this.bandList.getBands());
      })

      //Crear una banda
      socket.on('create-band', (data) => {
        this.bandList.addBand( data.name )
        this.io.emit('current-bands', this.bandList.getBands());
      })
    });
  }

}

module.exports = Sockets;