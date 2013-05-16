
jQuery.ajaxSetup(
    dataType: "json"
    timeout: 60


get = (url, data, callback) ->
  if not callback and typeof data == "function"
    callback = data
    data = null
  $.ajax(
      url: url
      data: data
      type: "GET"
      dataType: "json"
      success: _proxySuccess(callback)
      error: _proxyError(callback)


post = (url, data, callback) ->
  if not callback and typeof data == "function"
    callback = data
    data = null
  $.ajax(
      url: url
      data: data
      type: "POST"
      dataType: "json"
      success: _proxySuccess(callback)
      error: _proxyError(callback)


_proxyError = (callback) ->
  return (req, textStatus, errorThrown) ->
    callback(textStatus + " - " + errorThrown)


_proxySuccess = (callback) ->
  return (data) ->
    callback(null, data)
