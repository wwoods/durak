
require css!./card

class Card extends Backbone.Model
  @fromServer: (rankSuit) ->
    rank = rankSuit[0]
    suit = rankSuit[1]
    if rank == "T"
      rank = "10"
    return new Card({ rank, suit })


  defaults:
      rank: 'A'
      suit: 'S'


class CardSet extends Backbone.Collection
  model: Card


class CardView extends Backbone.View
  tagName: "div"
  className: "card unselectable"

  events:
      'mousedown': 'cardShow'


  initialize: () ->
    @_renderable = new playingCards.card(@model.get("rank"), @model.get("suit"))
    @$el.append(@_renderable.getHTML())
    @$el.addClass('playable')


  cardShow: () ->
    @$el.css('z-index', '1')
    $(document).one 'mouseup', () ->
      @$el.css('z-index', '')
    # Cancel the event
    return false
