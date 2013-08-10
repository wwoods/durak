
require css!./gameTable
require ../cardGenerics/card for Card, CardView
require ../cardGenerics/spread for Spread

require shared/constants for GameConstants

class GameTable extends Backbone.View
  tagName: 'div'
  className: 'game-table'

  @states: GameConstants.states

  initialize: (@_gameData) ->
    playingCards.card.defaults =
        imgPrefix: "src/shim/jsPlayingCards/"
    @render()


  render: () ->
    el = @$el
    if @_gameData.state == @states.INITIAL
      el.text("Waiting for other players")
      return

    @playerId = @_gameData.state.playerId
    el.empty()

    cards = @_gameData.state.hands[@playerId]
    if not cards?
      return
    @spread = new Spread()
    for c in cards
      @spread.add(Card.fromServer(c))
    el.append(@spread.el)
