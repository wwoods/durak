
require css!./gameTable

class GameTable extends Backbone.View
  tagName: 'div'
  className: 'game-table'

  initialize: () ->
    playingCards.card.defaults =
        imgPrefix: "src/lib/jsPlayingCards/"
    @render()


  render: () ->
    el = @$el
    @deck = el.playingCards()
    @deck.spread()
