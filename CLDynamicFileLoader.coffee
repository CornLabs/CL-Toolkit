CL.DynamicFileLoader =
  addLib: (json) ->
    CL.DynamicFileLoader.queue[CL.DynamicFileLoader.qh] =
      type: json.location.substr(json.location.lastIndexOf(".") + 1)
      src: json.location
      name: json.name
      allData: json

    CL.DynamicFileLoader.qh++

  head: document.head
  qh: 0
  queue: []
  afterLoad: null
  processQueue: (callback) ->
    callback = (if typeof (callback) is "function" then callback else CL.DynamicFileLoader.nullFunc)
    @afterLoad = callback
    @loadQueue()

  loadQueue: ->
    if CL.DynamicFileLoader.hasLibs()
      type = CL.DynamicFileLoader.queue[0].type.toLowerCase()
      callback = (if CL.DynamicFileLoader.qh is 1 then CL.DynamicFileLoader.afterLoad else CL.DynamicFileLoader.loadQueue)
      script = CL.DynamicFileLoader.cases[type] callback
      CL.DynamicFileLoader.head.appendChild script
      CL.DynamicFileLoader.queue.splice 0, 1
      CL.DynamicFileLoader.qh--
      callback callback  unless CL.DynamicFileLoader.aSyncCases[type]

  aSyncCases:
    css: 0
    js: 1

  cases:
    css: (term) ->
      name = CL.DynamicFileLoader.queue[0].name
      url = CL.DynamicFileLoader.queue[0].src
      media = CL.DynamicFileLoader.queue[0].allData.media
      script = document.createElement("link")
      script.type = "text/css"
      script.id = name
      script.media = media
      script.rel = "stylesheet"
      if typeof (CL.Framework.runningNativeMode) is "undefined"
        baseURL = ""
      else
        baseURL = (if (url.indexOf("http") < 0) then "http://" + window.location.hostname else "")
      script.href = baseURL + url
      CL.DynamicFileLoader.working = 0
      script

    js: (term) ->
      script = document.createElement("script")
      script.type = "text/javascript"
      script.onload = ->
        CL.DynamicFileLoader.head.removeChild this
        term()

      script.id = CL.DynamicFileLoader.queue[0].name
      if typeof (CL.Framework.runningNativeMode) is "undefined"
        baseURL = ""
      else
        baseURL = (if (CL.DynamicFileLoader.queue[0].src.indexOf("http") < 0) then "http://" + window.location.hostname else "")
      script.src = baseURL + CL.DynamicFileLoader.queue[0].src
      script

    json: (term, finalized, data) ->
      finalized = (if finalized then finalized else false)
      if finalized
        name = CL.DynamicFileLoader.queue[0].name
        s = document.createElement("script")
        s.type = "text/javascript"
        s.innerHTML = name + data
        s.id = name
        document.head.appendChild s
      else
        url = CL.DynamicFileLoader.queue[0].src
        request = new XMLHttpRequest()
        request.open "GET", url, true
        request.onreadystatechange = ->
          @call term, true, data  if request.status is 200  if request.readyState is 4

        request.send null

  hasLibs: ->
    CL.DynamicFileLoader.qh

  nullFunc: ->
