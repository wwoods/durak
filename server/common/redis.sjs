
require redis

client = redis.createClient()

module = this
for key, value of client
  async
    module[key] = -> value.apply(client, arguments)
