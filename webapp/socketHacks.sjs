
io.SocketNamespace.prototype.emitAsync = async (key, data, callback) ->
  console.log "starting #{ key }"
  # Since we hacked on the server side to be onAsync so that we get an error,
  # we don't actually have to do any trickiness here other than wait for the
  # response
  await data = @emit(key, data)
  finally
    console.log "finally #{ key }"
  return data
