
Backbone.View.prototype.bindTo = (other, event, callback) ->
  Backbone.View.prototype.listenTo(other, event, callback)
  callback.call(this)
