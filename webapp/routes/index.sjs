
require ./createGame
require ./root

class AppRouter extends Backbone.Router
  routes:
      "createGame": "createGame"
      "*actions": "root"

appRouter = new AppRouter()
appRouter.on "createGame", createGame.action
appRouter.on "root", root.action
