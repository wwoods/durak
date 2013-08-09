
require css!./gameTable
require ../cardGenerics/card for Card, CardView
require ../cardGenerics/spread for Spread

require shared/constants for GameConstants

class GameTable extends Backbone.View
  tagName: 'div'
  className: 'game-table'

  @states: GameConstants.states

  initialize: (gameData) ->
    playingCards.card.defaults =
        imgPrefix: "src/shim/jsPlayingCards/"
    @_gameData = gameData
    @render()


  render: () ->
    el = @$el
    if @_gameData.state == @states.INITIAL
      el.text("Waiting for other players")
      return

    @playerId = @_gameData.state.playerId

    cards = @_gameData.state.hands[@playerId]
    @spread = new Spread()
    for c in cards
      @spread.add(Card.fromServer(c))
    el.append(@spread.el)
