
require http
require ./routes
require ./websocket

run = async nocascade (app) ->
  routes.populate(app)
  server = http.createServer(app)
  websocket.listen(server)

  server.listen app.get('port'), () ->
    console.log('Express / socket server listening on port ' + app.get('port'))
