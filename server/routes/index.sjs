
index = (req, res) ->
  """GET home page"""
  res.render('index')


populate = (app) ->
  app.get('/', index)
