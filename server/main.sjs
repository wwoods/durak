
require http
require ./routes
require ./websocket

run = async (app) ->
  routes.populate(app)
  server = http.createServer(app)
  websocket.listen(server)

  await nocheck server.listen app.get('port')
  console.log('Express / socket server listening on port ' + app.get('port'))
