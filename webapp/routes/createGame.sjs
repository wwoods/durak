
require ../app

action = async noerror () ->
  await data = app.socket.emitAsync 'createGame'
  window.location.href = "#/game/" + data.gameId
