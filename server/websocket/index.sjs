
require crypto
require node-uuid as uuid
require socket.io as socketIo

_SALT = """Heyayewufhaewofhonv329h92y4987)(*@&$9879821748j[hnfoinoivnvzoesnvz;oe
    jfiwaej323n;nhfo32af;o32ianf;oianwja;in faisndf nz; szsdnf ;f__"'"""


listen = (server) ->
  io = socketIo.listen(server)
  io.on 'connection', (socket) ->
    socket.on 'newId', async noerror () ->
      sha = crypto.createHash("sha")
      sha.update(_SALT + uuid.v1())
      return { newId: sha.digest('hex') }

    socket.emit 'ready'
