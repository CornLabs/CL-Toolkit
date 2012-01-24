CL = {}  if typeof (CL) is "undefined"
CL.Framework =
  bundledModules: [ "dynloader", "shaderloader", "utils", "lightBox" ]
  bundledModulePaths:
    dynloader: "CLDynamicFileLoader.js"
    shaderloader: "CLShaderLoader.js"
    utils: "CLUtils.js"
    lightBox: "CLLightBox.js"

  modules: {}
  customModules: []
  version: "0.0.1"
  modulesDir: "/CL/"
  afterInit: null
  addCustomModule: (name, location) ->
    @customModules[name] = location

  grabModules: (init) ->
    unless init
      @loadLoader()
      return true
    for m of @bundledModules
      m = @bundledModules[m]
      unless m is "dynloader"
        @modules.dynloader.addLib
          name: m
          location: @modulesDir + @bundledModulePaths[m]
    @modules.dynloader.processQueue CL.Framework.loadModules

  loadModules: (callback) ->
    for m of CL.Framework.bundledModules
      m = CL.Framework.bundledModules[m]
      unless m is "dynloader"
        name = CL.Framework.bundledModulePaths[m]
        name = name.substr(name.lastIndexOf("CL") + 2)
        name = name.substr(0, name.lastIndexOf("."))
        CL.Framework.loadModule m, name
    CL.Framework.afterInit()

  loadModule: (name, module) ->
    @modules[name] = CL[module]
    CL[module].onModuleLoad()  if typeof (CL[module].onModuleLoad) is "function"

  loadLoader: (callback) ->
    script = document.createElement("script")
    script.src = @modulesDir + @bundledModulePaths.dynloader
    script.id = "dynloader"
    script.type = "text/javascript"
    script.onload = ->
      CL.Framework.loadModule "dynloader", "DynamicFileLoader"
      document.head.removeChild this
      CL.Framework.grabModules true, callback

    document.head.appendChild script
    true

  init: (callback) ->
    callback = (if typeof (callback) is "undefined" then CL.Framework.nullFunc else callback)
    CL.Framework.afterInit = callback
    CL.Framework.afterInit()

  nullFunc: ->

unless typeof Function::bind is "function"
  Function::bind = (bind) ->
    self = this
    ->
      args = Array::slice.call(arguments)
      self.apply bind or null, args


this.CL = CL