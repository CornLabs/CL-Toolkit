CL.LightBox =
  lightBoxes: []
  reuse: (id, name, handler) ->
    return null  unless id
    name = (if name then name else "New LightBox")
    handler = (if handler then handler else ->
      null
    )
    CL.LightBox.lightBoxes[id] = new CL.LightBox.Box(id, name, handler)  unless CL.LightBox.lightBoxes[id]
    CL.LightBox.lightBoxes[id]


CL.LightBox.Box = (ctrl, name, handler) ->
  @ctrlid = ctrl
  @element = document.createElement("div")
  @element.className = "lightboxWrapper"
  @element.id = "lightbox-" + ctrl
  @hasElement = true
  @wrapper = document.createElement("div")
  @wrapper.className = "lightboxContainer"
  @title = document.createElement("h2")
  @title.innerHTML = name
  @wrapper.appendChild @title
  @close = document.createElement("span")
  @close.className = "lightboxCloseButton"
  @close.innerHTML = "X"
  @close.onclick = =>
    @hide 5
  @wrapper.appendChild @close
  json = id: "form-" + @ctrlid
  @open = false
  if handler
    json.isJSHandled = true
    handler = handler.bind(this)
    @action = handler
    json.action = handler
  @form = CL.LightBox.getController("Form", json)
  @form.draw @wrapper
  console.log @form
  @element.appendChild @wrapper
  @controlls = []
  @head = 0

CL.LightBox.Box::show = (time, callback) ->
  return false  if @open
  time = (if time then time else 100)
  document.body.appendChild @element
  CL.Utils.animate @element, [
    property: "background"
    from: 0
    to: 0.8
    string: "radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"
  ,
    property: "background"
    from: 0
    to: 0.8
    string: "-moz-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"
  ,
    property: "background"
    from: 0
    to: 0.8
    string: "-o-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"
  ,
    property: "background"
    from: 0
    to: 0.8
    string: "-webkit-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"
  ,
    property: "background"
    from: 0
    to: 0.8
    string: "-ms-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"
   ], time, =>
    @controlls[0].element.focus()
    CL.Utils.animate @wrapper, [
      property: "opacity"
      from: 0
      to: 1
     ], time, =>
      @open = true
      callback()  if callback
  this

CL.LightBox.Box::hide = (time, callback) ->
  return false  unless @open
  time = (if time then time else 100)
  CL.Utils.animate @wrapper,
    property: "opacity"
    from: 1
    downto: 0
  , time, =>
    CL.Utils.animate @element, [
      property: "background"
      from: 0.8
      downto: 0
      string: "radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"
    ,
      property: "background"
      from: 0.8
      downto: 0
      string: "-o-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"
    ,
      property: "background"
      from: 0.8
      downto: 0
      string: "-moz-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"
    ,
      property: "background"
      from: 0.8
      downto: 0
      string: "-webkit-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"
    ,
      property: "background"
      from: 0.8
      downto: 0
      string: "-ms-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"
     ], time, =>
      document.body.removeChild @element
      @open = false
      callback()  if callback
  this

CL.LightBox.Box::schedule = (op, time, args) ->
  ctrl = @ctrlid
  if CL.LightBox.reuse(ctrl)[op]
    setTimeout (->
      CL.LightBox.reuse(ctrl)[op] args
    ), time

CL.LightBox.Box::addController = (type, json) ->
  @controlls[@head] = CL.LightBox.getController(type, json, @head)
  @controlls[@controlls[@head].id] = @controlls[@head]
  @controlls[@head].draw @form
  @head++
  this

CL.LightBox.Box::setProperty = (fori, prop, to) ->
  @controlls[fori].modify prop, to, 0
  console.log @controlls[fori][prop]
  this

head = 0
CL.LightBox.ControlPrototype = (json) ->
  json = CL.Utils.checkJson(json)
  @hasElement = true
  @type = (if json.type then json.type else "p")
  @id = (if json.id then json.id else "control-" + @ctrlid)
  @ctrlid = head++
  @value = (if json.value then json.value else "Random Control Value")
  @drawLocation = null
  @prototypeParent = @__proto__
  @element = @createElement()
  @

CL.LightBox.ControlPrototype::createElement = (element) ->
  elem = document.createElement(@type)
  elem.id = @id
  elem

CL.LightBox.ControlPrototype::getElement = ->
  (if @element then @element else @createElement())

CL.LightBox.ControlPrototype::findElement = ->
  document.getElementById @id

CL.LightBox.ControlPrototype::updateElement = (elem) ->
  dl = (if typeof (@drawLocation.hasElement) isnt "undefined" then @drawLocation.element else @drawLocation)
  dl.appendChild @element  unless @findElement()

CL.LightBox.ControlPrototype::updateDrawLocation = (on_) ->
  i = @drawLocation
  @drawLocation = on_
  @element.parentNode.removeChild @element  if i

CL.LightBox.ControlPrototype::draw = (on_, stack) ->
  @updateDrawLocation on_  if not @drawLocation or @drawLocation isnt on_
  @element = @getElement()  unless @element
  @element.id = @id
  @updateElement @element

CL.LightBox.ControlPrototype::modify = (what, to, stack) ->
  this[what] = to
  @draw @drawLocation  if @drawLocation

CL.LightBox.ControlPrototype::completeDraw = (on_, stack) ->
  stack = (if stack then stack else 0)
  elem = @prototypeParent
  i = 0
  while i < stack
    elem = elem.prototypeParent
    i++
  elem.draw.call this, on_, stack + 1

CL.LightBox.ControlPrototypes = {}
CL.LightBox.ControlPrototypes.Input = (json) ->
  json = CL.Utils.checkJson(json,
    type: "input"
  )
  CL.LightBox.ControlPrototype.call this, json
  @name = (if json.name then json.name else @id)
  @inputType = "text"

CL.LightBox.ControlPrototypes.Input:: = new CL.LightBox.ControlPrototype()
CL.LightBox.ControlPrototypes.Input::constructor = CL.LightBox.ControlPrototypes.Input
CL.LightBox.ControlPrototypes.Input::draw = (on_, stack) ->
  @element.type = @inputType
  @element.placeholder = @value
  @element.name = @name
  @completeDraw on_, stack

CL.LightBox.ControlPrototypes.Description = (json) ->
  json = CL.Utils.checkJson(json,
    type: "p"
  )
  CL.LightBox.ControlPrototype.call this, json

CL.Utils.extend CL.LightBox.ControlPrototypes.Description
CL.LightBox.ControlPrototypes.Description::draw = (on_, stack) ->
  @element.innerHTML = @value
  @completeDraw on_, stack

CL.LightBox.ControlPrototypes.Description::modify = (what, to, stack) ->
  elem = CL.Utils.prototypeStack(this, stack)
  @element.innerHTML = @value
  elem.prototypeParent.modify.call this, what, to, stack + 1

CL.LightBox.ControlPrototypes.Password = (json) ->
  json = CL.Utils.checkJson(json)
  CL.LightBox.ControlPrototypes.Input.call this, json
  @inputType = "password"

CL.Utils.extend CL.LightBox.ControlPrototypes.Password, CL.LightBox.ControlPrototypes.Input
CL.LightBox.ControlPrototypes.Form = (json) ->
  json = CL.Utils.checkJson(json,
    type: "form"
  )
  CL.LightBox.ControlPrototype.call this, json
  @isJSHandled = (if json.isJSHandled then 1 else 0)
  @action = (if json.action then json.action else (e) ->
    e.preventDefault()
  )
  @method = (if json.method then json.method else "GET")

CL.Utils.extend CL.LightBox.ControlPrototypes.Form
CL.LightBox.ControlPrototypes.Form::draw = (on_, stack) ->
  if @isJSHandled
    @element.onsubmit = (e) =>
      e.preventDefault()
      @action()
      false
  @element.method = @method
  @completeDraw on_, stack

CL.LightBox.ControlPrototypes.Submit = (json) ->
  json = CL.Utils.checkJson(json,
    type: "input"
  )
  CL.LightBox.ControlPrototypes.Input.call this, json
  @inputType = "submit"

CL.Utils.extend CL.LightBox.ControlPrototypes.Submit, CL.LightBox.ControlPrototypes.Input
CL.LightBox.ControlPrototypes.Submit::draw = (on_, stack) ->
  @element.value = @value
  @completeDraw on_, stack

CL.LightBox.ControlPrototypes.FileInput = (json) ->
  json = CL.Utils.checkJson(json,
    type: "input"
  )
  CL.LightBox.ControlPrototypes.Input.call this, json
  @inputType = "file"

CL.Utils.extend CL.LightBox.ControlPrototypes.FileInput, CL.LightBox.ControlPrototypes.Input
CL.LightBox.getController = (type, args, ctrl) ->
  (if CL.LightBox.ControlPrototypes[type] then new CL.LightBox.ControlPrototypes[type](args, ctrl) else null)

lb = null

