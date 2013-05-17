
require ../app

action = async () ->
  await data = app.socket.emitAsync 'createGame'
  window.location.href = "#/game/" + data.gameId
