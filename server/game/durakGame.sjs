
require backbone as Backbone

require ../common/redis
require ../common/uuid

class DurakGame uses Backbone.Events
  _EXPIRE_TIME: 7 * 24 * 60 * 60

  @openGames: {}


  @states:
      INITIAL: 1


  @load: async (gameId) ->
    if gameId of @openGames
      return @openGames[gameId]

    game = new DurakGame()
    game.gameId = gameId
    await data = redis.get game._getKey()
    if not data?
      throw { error: "invalid gameId: #{ gameId }" }
    game.data = JSON.parse(data)
    @openGames[gameId] = game
    console.log "Game #{ gameId } loaded"
    return game


  constructor: () ->
    @gameId = null
    @viewers = []
    @data =
        state: @class.states.INITIAL
        players: []
        deck: []
        hands: []
        attacks: []
        trashCount: 0
        version: 1


  addPlayer: (userId) ->
    @data.players.push(userId)


  renderPlayer: (userSocket) ->
    userId = userSocket.userId
    if @data.state == @class.states.INITIAL and userId not in @data.players
      @addPlayer(userId)
      @save()

    # Ensure they'll get updates as well
    if userSocket not in @viewers
      @_viewerRegister(userSocket)
    stateBase = JSON.parse(JSON.stringify(@data))
    return { gameData: stateBase }


  save: async () ->
    if @gameId == null
      @gameId = uuid.next()
      @openGames[@gameId] = @
      console.log "Game #{ @gameId } loaded"
    await redis.set @_getKey(), JSON.stringify(@data)
    await redis.expire @_getKey(), @class._EXPIRE_TIME


  _getKey: () ->
    return "game_#{ @gameId }"


  _viewerRegister: (userSocket) ->
    @viewers.push(userSocket)
    @listenTo(userSocket, "leaveGame", @@_viewerUnregister)


  _viewerUnregister: (userSocket) ->
    @stopListening(userSocket)
    @viewers = @viewers.filter (v) -> v != userSocket
    if @viewers.length == 0
      delete @class.openGames[@gameId]
      console.log "Game #{ @gameId } closed"
