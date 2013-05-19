
require ./createGame
require ./loadGame
require ./root

class AppRouter extends Backbone.Router
  routes:
      "createGame": "createGame"
      "game/:gameId": "loadGame"
      "*actions": "root"

appRouter = new AppRouter()
appRouter.on "route:createGame", createGame.action
appRouter.on "route:loadGame", loadGame.action
appRouter.on "route:root", root.action
