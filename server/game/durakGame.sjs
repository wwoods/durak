
require backbone as Backbone

require ../common/redis
require ../common/uuid

class DurakGame uses Backbone.Events
  _EXPIRE_TIME: 7 * 24 * 60 * 60

  @openGames: {}


  @states:
      INITIAL: 1
      PLAYING: 2


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
        state: @states.INITIAL
        players: []
        deck: []
        hands: []
        attacks: []
        attacker: 0
        trashCount: 0
        version: 1


  addPlayer: async (userId) ->
    @data.players.push(userId)
    if @data.players.length == 2
      await @start()
    else
      await @save()


  renderPlayer: (userSocket) ->
    userId = userSocket.userId

    # Ensure they'll get updates as well
    if userSocket not in @viewers
      @_viewerRegister(userSocket)
    playerId = @data.players.indexOf(userId)
    state =
        state: @data.state
        deck: @data.deck.length
        trashCount: @data.trashCount
        hands: []
        attacks: @data.attacks
        attacker: @data.attacker
        playerId: playerId
    for h, i in @data.hands
      if i != playerId
        state.hands.push(h.length)
      else
        state.hands.push(h)
    return { gameId: @gameId, gameData: state }


  save: async () ->
    if @gameId == null
      @gameId = uuid.next()
      @openGames[@gameId] = @
      console.log "Game #{ @gameId } loaded"
    await redis.set @_getKey(), JSON.stringify(@data)
    await redis.expire @_getKey(), @class._EXPIRE_TIME


  start: async () ->
    @data.state = @states.PLAYING
    for rank in [ 'A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6' ]
      for suit in [ 'H', 'S', 'D', 'C' ]
        @data.deck.push(rank + suit)
    # Shuffle
    i = @data.deck.length - 1
    while i > 0
      j = Math.floor(Math.random() * (i + 1))
      t = @data.deck[i]
      @data.deck[i] = @data.deck[j]
      @data.deck[j] = t
      i -= 1

    # Deal
    for p in @data.players
      @data.hands.push([])
    for i in [ 0, 1, 2, 3, 4, 5 ]
      for h in @data.hands
        h.push(@data.deck.pop())

    await @save()
    @trigger "gameEvent", { type: "dealt" }


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
      @stopListening()
      console.log "Game #{ @gameId } closed"
