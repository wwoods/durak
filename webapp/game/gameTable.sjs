
require css!./gameTable
require ./card for Card

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
    for c in @deck.cards
      el.append(new Card(model: c).el)
