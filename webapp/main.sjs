
require shared/models for ColorHolder
require ./views for ColorView

require ./app
require ./routes for appRouter
require ./game/gameTable for GameTable


appRouter.on "route:default", async (actions) ->
  if actions
    $('body').html("Unrecognized: #{ actions }; <a href="#">Start over</a>")
    return

  $('body').html("LOADED; you are #{ localStorage.userId }")

  $('body').append(new GameTable().el)


$ async () ->
  """DOM has loaded; activate backbone routers and be happy!"""
  if typeof localStorage == "undefined"
    $('body').html("You must be using an HTML5-compliant browser with "
        + "localStorage; try Chrome or Firefox!")
    return

  await
    app.socket = io.connect()
    await data, error = app.socket.once 'ready'

    if not localStorage.userId?
      await resp, error = app.socket.emit 'newId'
      localStorage.userId = resp.newId
  catch e
    console.log e
    $('body').html("Initialization failed: #{ e and e.message or e }")
    throw e

  Backbone.history.start()
