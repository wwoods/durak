
require http
require ./websocket

run = async extern nocascade (app) ->
  server = http.createServer(app)
  websocket.listen(server)

  await extern server.listen app.get('port')
