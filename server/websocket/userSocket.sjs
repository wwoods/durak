
require backbone as Backbone

require ../game/durakGame for DurakGame
require ../common/redis
require ../common/uuid

class UserSocket uses Backbone.Events
  _USER_EXPIRE: 7 * 24 * 60 * 60

  constructor: (@socket) ->
    @currentGame = null
    @userId = null

    bind = (event, method) ->
      realMethod = async (data, callback) ->
        await r = method(data, callback)
        catch e
          if e.error?
            # Expected, or at least processed; don't need a trace.  Send
            # the error as-is to the client, with any extra data filtered out.
            throw { error: e.error }
          console.log e.stack
          throw { error: "Unknown error" }
        return r
      @socket.on event, realMethod

    for key in [ 'auth', 'createGame', 'disconnect', 'loadGame', 'newId' ]
      async
        bind(key, -> @[key].apply(@, arguments))
        console.log "Bound #{ key }"


  auth: async (auth, callback) ->
    console.log "auth"
    authKey = @_getAuthKey(auth.id)
    await r = redis.hget authKey, "auth"
    catch e
      # Is it a connectivity issue?  If so, this will raise an exception.
      await redis.get "_"
      throw { error: "invalid" }

    if r == null or r != auth.auth
      throw { error: "invalid" }

    @userId = auth.id
    await redis.expire(authKey, @class._USER_EXPIRE)
    return { success: true }


  createGame: async (data, callback) ->
    console.log "createGame"
    game = new DurakGame()
    game.addPlayer(@userId)
    await game.save()
    @_setGame(game)
    return { success: true, gameId: game.gameId,
        state: game.renderPlayer(@) }


  disconnect: async (data, callback) ->
    # Trigger in backbone's API
    @trigger("leaveGame", @)
    @stopListening()


  loadGame: async (data, callback) ->
    console.log "loadGame"
    await game = DurakGame.load(data.gameId)
    # Auto adds player if they can join, otherwise renders them as an
    # observer
    @_setGame(game)
    return { game: game.renderPlayer(@) }


  newId: async (data, callback) ->
    console.log "newId"
    creds =
        success: true
        id: uuid.next()
        auth: uuid.next()
    authKey = @_getAuthKey(creds.id)
    await redis.del authKey
    await redis.hset authKey, "auth", creds.auth
    await redis.expire authKey, @class._USER_EXPIRE
    @userId = creds.id
    return creds


  _getAuthKey: (id) ->
    """Gets the redis key for id's information"""
    return "auth_#{ id }"


  _setGame: (game) ->
    if @currentGame?
      @trigger("leaveGame", @)
      @stopListening(@currentGame)
    @currentGame = game
