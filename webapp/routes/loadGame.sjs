
require ../app
require ../game/gameTable for GameTable

action = async (gameId) ->
  console.log "Loading game #{ gameId }"
  await r = app.socket.emitAsync 'loadGame', gameId: gameId
  catch e
    if e.error == "invalid"
      $('body').html("Invalid game ID; <a href='#'>Start Over</a>")
      return
    throw e
  console.log r
  gt = new GameTable(r.game)
  $('body').empty().append(gt.el)
