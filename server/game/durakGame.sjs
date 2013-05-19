
require ../common/redis
require ../common/uuid

class DurakGame
  _EXPIRE_TIME: 7 * 24 * 60 * 60

  states:
      INITIAL: 1

  constructor: () ->
    @gameId = null
    @data =
        state: @class.states.INITIAL
        players: []
        deck: []
        trashCount: 0
        version: 1


  addPlayer: (userId) ->
    @data.players.push(userId)


  load: async (gameId) ->
    @gameId = gameId
    await data = redis.get @_getKey()
    if not data?
      throw { error: "invalid" }
    @data = JSON.parse(data)


  renderPlayer: (userId) ->
    if @data.state == @class.states.INITIAL and userId not in @data.players
      @addPlayer(userId)
      @save()
    return { ha: true }


  save: async () ->
    if @gameId == null
      @gameId = uuid.next()
    await redis.set @_getKey(), JSON.stringify(@data)
    await redis.expire @_getKey(), @class._EXPIRE_TIME


  _getKey: () ->
    return "game_#{ @gameId }"
