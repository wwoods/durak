
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
app.set('view engine', 'jade')
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(app.router)
# /src will be populated by SeriousJS depending on the running options

callback = () ->
  # development only
  if 'development' == app.get('env')
    app.use(express.errorHandler())
  main.run(app)

seriousjs.setupRequireJs(app, express, __dirname + '/webapp', callback)
