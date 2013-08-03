
require shared/models for ColorHolder
require ./views for ColorView

require ./app
require ./routes/index
require ./game/gameTable for GameTable

require ./backboneHacks
require ./socketHacks

$ async nocheck () ->
  """DOM has loaded; activate backbone routers and be happy!"""
  if typeof localStorage == "undefined"
    $('body').html("You must be using an HTML5-compliant browser with "
        + "localStorage; try Chrome or Firefox!")
    return

  await
    app.socket = io.connect()
    await data = app.socket.emitAsync(
        'auth'
        id: localStorage.userId
        auth: localStorage.userAuth
    catch e
      console.trace(e)
      if e.error.indexOf("invalid") != 0
        throw e
      await data = app.socket.emitAsync "newId"
      localStorage.userId = data.id
      localStorage.userAuth = data.auth
  catch e
    console.trace e
    $('body').html("Initialization failed: #{ e and e.message or e }")
    throw e

  console.log "Backbone.history.start()"
  Backbone.history.start()
