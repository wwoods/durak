
action = (actions) ->
  if actions
    $('body').html('Unrecognized: #{ actions }; <a href="#">Start over</a>')
    return

  $('body').html """
      <p>LOADED</p>
      <a href="#/createGame">Make a game</a>
      """
