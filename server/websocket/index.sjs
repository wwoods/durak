
require ../common/uuid
require ./userSocket for UserSocket
require socket.io as socketIo

listen = (server) ->
  io = socketIo.listen(server)
  io.on 'connection', (socket) ->
    new UserSocket(socket)
