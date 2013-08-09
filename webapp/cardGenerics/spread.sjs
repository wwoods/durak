
require css!./spread

require ./card for Card, CardSet, CardView

class Spread extends Backbone.View
  tagName: "div"
  className: "cardSpread"

  initialize: { dropZone = false } ->
    _.bindAll(@, "render")

    if not @collection instanceof CardSet
      @collection = new CardSet()
    console.log @collection

    @listenTo(@collection, "add remove change", @render)

    @_dropZone = false
    @render()


  add: (card) ->
    @collection.add(card)


  render: () ->
    el = @$el
    $('.card', el).remove()

    top = 0
    topInc = 0
    if @options.diagonal
      topInc = 0.3

    for c in @collection.models
      card = new CardView(model: c)
      card.$el.css top: top + "em"
      top += topInc
      el.append(card.el)


  setDroppable: (value) ->
    @_dropZone = value
    if @_dropZone
      @$el.prepend('<div class="dropTarget"></div>')
    else
      $('.dropTarget', @$el).remove()
