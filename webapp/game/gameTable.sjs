
require css!./gameTable
require ../cardGenerics/card for Card
require ../cardGenerics/spread for Spread
require ../cardGenerics/spreadModel for SpreadModel

class GameTable extends Backbone.View
  tagName: 'div'
  className: 'game-table'

  initialize: () ->
    playingCards.card.defaults =
        imgPrefix: "src/shim/jsPlayingCards/"
    @render()


  render: () ->
    el = @$el
    @deck = el.playingCards()
    for c in @deck.cards
      el.append(new Card(model: c).el)

    @spread = new Spread(model: new SpreadModel(dropTarget: true))
    @spread.add(@deck.draw())
    @spread.add(@deck.draw())
    @spread.add(@deck.draw())
    el.append(@spread.el)

    @spread2 = new Spread(diagonal: true)
    @spread2.add(@deck.draw())
    @spread2.add(new playingCards.card('2', 'H'))
    el.append(@spread2.el)
