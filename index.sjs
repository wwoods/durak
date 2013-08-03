# Module dependencies

require express
require http
require path
require seriousjs

require ./server/main

app = express()

# all environments
app.set('port', process.env.PORT or 3000)
app.set('views', __dirname + '/server/views')
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(app.router)

async
  # Link our webapp into /src
  await r = seriousjs.requireJs().setupWebapp(app, express,
      __dirname + '/webapp')
  if not r
    return

  # development only
  if 'development' == app.get('env')
    app.use(express.errorHandler())

  # Expose a basic HTML page to serve the app at /src
  seriousjs.requireJs().serveWebapp(
      app, '/',
      shim: [ '../index.css', 'jsPlayingCards/playingCards.ui.css',
        'jquery-1.9.1.min',
        'underscore-min', 'backbone-min', '/socket.io/socket.io',
        'jsPlayingCards/playingCards', 'jsPlayingCards/playingCards.ui' ]
      title: 'Durak'

  await main.run(app)