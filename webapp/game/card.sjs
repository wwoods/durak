
require css!./card

class Card extends Backbone.View
  tagName: "div"
  className: "card"

  events:
      'mouseover': 'cardShowAll'
      'mouseout': 'cardShowNormal'

  initialize: () ->
    @$el.append(@model.getHTML())

  cardShowAll: () ->
    @$el.css('z-index', '2')

  cardShowNormal: () ->
    @$el.css('z-index', '')
