
class SpreadModel extends Backbone.Model
  defaults: () ->
    return
        cards: []
        dropTarget: false


  add: (card) ->
    # Just to get change to fire correctly...
    newCards = _.clone(@get("cards"))
    newCards.push(card)
    @set(cards: newCards)
