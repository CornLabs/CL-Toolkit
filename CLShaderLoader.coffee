CL.ShaderLoader =
  loadFile: (url, no_, callback, errorCallback) ->
    request = new XMLHttpRequest()
    request.open "GET", url, true
    request.onreadystatechange = ->
      if request.readyState is 4
        if request.status is 200
          callback request.responseText, no_
        else
          errorCallback url

    request.send null

  loadFiles: (urls, callback, errorCallback, GCB) ->
    partialCallback = (text, urlIndex) ->
      result[result.length] = {}
      result[result.length - 1].type = urls[urlIndex][1]
      result[result.length - 1].text = text
      result[result.length - 1].url = urls[urlIndex][0]
      numComplete++
      callback result, GCB  if numComplete is numUrls
    numUrls = urls.length
    numComplete = 0
    result = []
    i = 0
    while i < numUrls
      CL.ShaderLoader.loadFile urls[i][0], i, partialCallback, errorCallback
      i++

  appendShaders: (shaders, callback) ->
    for shader of shaders
      shader = shaders[shader]
      elem = document.createElement("script")
      url = shader.url
      alert "shader.url"
      elem.id = url.substr(url.lastIndexOf("/") + 1)
      elem.innerHTML = shader.text
      elem.type = shader.type
      document.head.appendChild elem
    callback()
