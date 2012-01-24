CL.Utils =
  checkJson: (json, alt) ->
    json = (if json then json else {})
    for item of alt
      json[item] = alt[item]
    (if json then json else {})

  extend: (who, what) ->
    who:: = new (if typeof (what) isnt "undefined" then what else CL.LightBox.ControlPrototype)()
    who::constructor = who

  animate: (object, properties, time, callback, tick) ->
    callback = (if callback then callback else ->
      null
    )
    tick = (if tick then tick else 1)
    properties = [ properties ]  if not properties.length and properties
    percent = tick / time
    style = ""
    for p of properties
      p = properties[p]
      value = (if p.to then (p.to - p.from) * percent else p.from - (p.from - p.downto) * percent)
      output = value
      unless typeof (p.string) is "undefined"
        output = p.string
        until output.indexOf("$#") is -1
          start = output.indexOf("$#") + 2
          end = output.indexOf("#$", start)
          substr = output.substring(start, end)
          output = output.replace("$#" + substr + "#$", eval(substr))
      style = style + p.property + ": " + output + "; "
    object.setAttribute "style", style
    if tick <= time
      setTimeout (->
        CL.Utils.animate object, properties, time, callback, tick + 1
      ), 1
    else
      callback()

  prototypeStack: (object, stack) ->
    stack = (if stack then stack else 0)
    elem = object
    i = 1
    while i <= stack
      elem = elem.__proto__
      i++
    elem
