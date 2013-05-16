
require css!./card

class Card extends Backbone.View
  tagName: "div"
  className: "card unselectable"

  events:
      'mousedown': 'cardShow'


  initialize: () ->
    @$el.append(@model.getHTML())
    @$el.addClass('playable')


  cardShow: () ->
    @$el.css('z-index', '1')
    $(document).one 'mouseup', () ->
      @$el.css('z-index', '')
    # Cancel the event
    return false
