
require css!./spread

require ./card for Card
require ./spreadModel for SpreadModel

class Spread extends Backbone.View
  tagName: "div"
  className: "cardSpread"

  initialize: () ->
    if not @model instanceof SpreadModel
      @model = new SpreadModel()
    console.log @model

    @listenTo(@model, "change", @render)
    @bindTo(@model, "change:dropTarget", @_checkDrop)

    @render()


  add: (card) ->
    @model.add(card)


  render: () ->
    el = @$el
    $('.card', el).remove()

    top = 0
    topInc = 0
    if @options.diagonal
      topInc = 0.3

    for c in @model.get("cards")
      card = new Card(model: c)
      card.$el.css top: top + "em"
      top += topInc
      el.append(card.el)


  _checkDrop: () ->
    if @model.get("dropTarget")
      @$el.prepend('<div class="dropTarget"></div>')
    else
      $('.dropTarget', @$el).remove()
