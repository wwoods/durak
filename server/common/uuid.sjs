
require crypto
require node-uuid as uuid

_SALT = """Heyayewufhaewofhonv329h92y4987)(*@&$9879821748j[hnfoinoivnvzoesnvz;oe
    jfiwaej323n;nhfo32af;o32ianf;oianwja;in faisndf nz; szsdnf ;f__"'"""

next = () ->
  sha = crypto.createHash("sha")
  sha.update(_SALT + uuid.v1())
  return sha.digest('hex')
