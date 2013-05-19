
io.SocketNamespace.prototype.emitAsync = async (key, data, callback) ->
  # Since we hacked on the server side to be onAsync so that we get an error,
  # we don't actually have to do any trickiness here other than wait for the
  # response, which will re-raise the error
  await data = @emit(key, data)
  return data
