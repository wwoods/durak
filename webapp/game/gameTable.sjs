
require css!./gameTable

class GameTable extends Backbone.View
  tagName: 'div'
  className: 'game-table'

  initialize: () ->
    @render()


  render: () ->
    el = @$el
    @deck = el.playingCards(imgPrefix: "src/lib/jsPlayingCards/")
    @deck.spread()
