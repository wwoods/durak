
require ../common/uuid

_auth = {}

class UserSocket
  constructor: (@socket) ->
    @userId = null

    @socket.on 'newId', async (data) ->
      creds =
          success: true
          id: uuid.next()
          auth: uuid.next()
      _auth[creds.id] = creds.auth
      @userId = creds.id
      return creds


    @socket.on 'auth', async (auth) ->
      if not auth.id of _auth or _auth[auth.id] != auth.auth
        throw { error: "invalid" }
      @userId = auth.id
      return { success: true }
