CL = {}
CL.Framework = {
	bundledModules: [
		"dynloader",
		"shaderloader",
		"lightBox"
	],
	bundledModulePaths: {
		dynloader: "CLDynamicFileLoader.js",
		shaderloader: "CLShaderLoader.js",
		lightBox: "CLLightBox.js"
	},
	modules: {},
	customModules: [],
	version: "0.0.1",
	modulesDir: "/CL/",
	afterInit: null,
	addCustomModule: function(name, location) {
		this.customModules[name] = location;
	},
	grabModules: function(init) {
		if (!init) { this.loadLoader(); return true; }
		for (m in this.bundledModules) {
			m = this.bundledModules[m]
			if (m != "dynloader")	this.modules.dynloader.addLib(m, this.modulesDir + this.bundledModulePaths[m]);
		}
		this.modules.dynloader.processQueue(CL.Framework.loadModules)
	},
	loadModules: function(callback)	{		
		for(m in CL.Framework.bundledModules) {
			m = CL.Framework.bundledModules[m]
			if (m != "dynloader")	{
				name = CL.Framework.bundledModulePaths[m]
				name = name.substr(name.lastIndexOf("CL") + 2)
				name = name.substr(0, name.lastIndexOf("."))
				CL.Framework.loadModule(m, name)
			}
		}
		CL.Framework.afterInit()
	},
	loadModule: function(name, module)	{
		this.modules[name] = CL[module];
	},
	loadLoader: function(callback)	{
		script = document.createElement("script");
		script.src = this.modulesDir + this.bundledModulePaths.dynloader;
		script.id = "dynloader";
		script.type = 'text/javascript';
		script.onload = function() { 
			CL.Framework.loadModule("dynloader", "DynamicFileLoader");
			document.head.removeChild(this)
			CL.Framework.grabModules(true, callback); 
		}
		document.head.appendChild(script)
		return true;
	},
	init: function(callback){
		callback = typeof(callback) == "undefined" ? CL.Framework.nullFunc : callback
		CL.Framework.afterInit = callback;
		this.grabModules()
	},
	nullFunc: function() {}
}