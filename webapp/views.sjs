
require css!./views

class ColorView extends Backbone.View
  className: "color-view"

  events:
      "click": "pickColor"

  initialize: () ->
    @listenTo(@model, "change", @render)
    @$el.data('bbView', @)

  pickColor: () ->
    @model.promptColor()

  render: () ->
    @$el.css('background-color', @model.get('color'))
