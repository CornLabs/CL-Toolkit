CL.LightBox = {
	lightBoxes: [],
	reuse: function(id, name, handler)	{
		if (!id)	return null;
		name = name ? name : "New LightBox"
		handler = handler ? handler : function() { return null }
		if (!CL.LightBox.lightBoxes[id]) CL.LightBox.lightBoxes[id] = new CL.LightBox.Box(id, name, handler);
		return CL.LightBox.lightBoxes[id];
	},
	onModuleLoad: function()	{	
		CL.DynamicFileLoader.addLib({"id": "lightBoxStyle", "location": CL.Framework.modulesDir + "res/lightbox.css", "media": "screen"})
		CL.DynamicFileLoader.processQueue()
	}
}
CL.LightBox.Box = function(ctrl, name, handler)	{
	this.ctrlid = ctrl;
	this.element = document.createElement("div")
	this.element.className="lightboxWrapper"
	this.element.id = "lightbox-"+ctrl
	this.hasElement = true
	this.wrapper = document.createElement("div")
	this.wrapper.className="lightboxContainer"
	this.title = document.createElement("h2")
	this.title.innerHTML = name
	this.wrapper.appendChild(this.title)
	json = {id: "form-" + this.ctrlid}
	this.open = false;
	if (handler)	{
		json.isJSHandled = true
		handler = handler.bind(this)
		json.action = handler
	}
	this.form = CL.LightBox.getController("Form", json)
	this.form.draw(this.wrapper)
	console.log(this.form)
	this.element.appendChild(this.wrapper)

	this.controlls = []
	this.head = 0
}
CL.LightBox.Box.prototype.show = function(time, callback)	{
	if (this.open) return false;
	time = time ? time : 100
	document.body.appendChild(this.element)
	CL.Utils.animate(this.element, [
		{"property": "background", "from": 0, "to": 0.8, "string": "radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"},
		{"property": "background", "from": 0, "to": 0.8, "string": "-moz-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"},
		{"property": "background", "from": 0, "to": 0.8, "string": "-o-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"},
		{"property": "background", "from": 0, "to": 0.8, "string": "-webkit-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"},
		{"property": "background", "from": 0, "to": 0.8, "string": "-ms-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"},
		  
	], time, function() {		
		CL.Utils.animate(this.wrapper, [
			{"property": "opacity", "from": 0, "to": 1}			  
		], time, function(){ this.open = true; if(callback) callback() }.bind(this))
	}.bind(this) )
	return this;
}
CL.LightBox.Box.prototype.hide = function(time, callback)	{
	if (!this.open) return false;
	time = time ? time : 100
	CL.Utils.animate(this.wrapper, {"property": "opacity", "from": 1, "downto": 0}, time, function(){
		CL.Utils.animate(this.element, [
			{"property": "background", "from": 0.8, "downto": 0, "string": "radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"},
			{"property": "background", "from": 0.8, "downto": 0, "string": "-o-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"},
			{"property": "background", "from": 0.8, "downto": 0, "string": "-moz-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"},
			{"property": "background", "from": 0.8, "downto": 0, "string": "-webkit-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"},
			{"property": "background", "from": 0.8, "downto": 0, "string": "-ms-radial-gradient(center center, circle farthest-corner, rgba(0, 0, 0, $#value - 0.3#$), rgba(0, 0, 0, $#value#$) 100%)"},
			  
		], time, function(){		
			document.body.removeChild(this.element)
			this.open = false;
			if(callback) callback() 
		}.bind(this))
	}.bind(this) )
	return this;
}
CL.LightBox.Box.prototype.addController = function(type, json)	{
	this.controlls[this.head] = CL.LightBox.getController(type, json, this.head)
	this.controlls[this.controlls[this.head].id] = this.controlls[this.head]
	this.controlls[this.head].draw(this.form)
	this.head++
	return this;
}
CL.LightBox.Box.prototype.setProperty = function( fori, prop, to )	{
	this.controlls[fori].modify(prop, to, 0)
	console.log(this.controlls[fori][prop])
	return this
}
head = 0
CL.LightBox.ControlPrototype = function(json)	{
	json = CL.Utils.checkJson(json)
	this.hasElement = true
	this.type = json.type?json.type:"p";
	this.id = json.id?json.id:"control-"+this.ctrlid;
	this.ctrlid = head++;
	this.value = json.value?json.value:"Random Control Value"
	this.drawLocation = null;
	this.prototypeParent = this.__proto__
	this.element = this.createElement();
}
CL.LightBox.ControlPrototype.prototype.createElement = function(element)	{
	elem = document.createElement(this.type)
	elem.id = this.id
	return elem
}
CL.LightBox.ControlPrototype.prototype.getElement = function()	{
	return this.element?this.element:this.createElement()
}
CL.LightBox.ControlPrototype.prototype.findElement = function()	{
	return document.getElementById(this.id)
}
CL.LightBox.ControlPrototype.prototype.updateElement = function(elem)	{
	dl = typeof(this.drawLocation.hasElement) != "undefined" ? this.drawLocation.element : this.drawLocation
	if (!this.findElement())		dl.appendChild(this.element)
}
CL.LightBox.ControlPrototype.prototype.updateDrawLocation = function(on)	{
	i = this.drawLocation;
	this.drawLocation = on;
	if (i)		this.element.parentNode.removeChild(this.element)
}
CL.LightBox.ControlPrototype.prototype.draw = function(on, stack)	{
	if (!this.drawLocation || this.drawLocation != on)	this.updateDrawLocation(on);
	if (!this.element) this.element = this.getElement()
	this.element.id = this.id
	this.updateElement(this.element)
}
CL.LightBox.ControlPrototype.prototype.modify = function(what, to, stack)	{
	this[what] = to;
	if (this.drawLocation) this.draw(this.drawLocation)
}
CL.LightBox.ControlPrototype.prototype.completeDraw = function(on, stack)	{
	stack = stack?stack:0
	elem = this.prototypeParent
	for(i = 0; i < stack; i++ 	)	elem = elem.prototypeParent
	return elem.draw.call(this, on, stack + 1)
}
CL.LightBox.ControlPrototypes = {}
CL.LightBox.ControlPrototypes.Input = function(json)	{
	json = CL.Utils.checkJson(json, {type: "input"})
	CL.LightBox.ControlPrototype.call(this, json)
	this.name = json.name?json.name:this.id
	this.inputType = "text"
}
CL.LightBox.ControlPrototypes.Input.prototype = new CL.LightBox.ControlPrototype();
CL.LightBox.ControlPrototypes.Input.prototype.constructor = CL.LightBox.ControlPrototypes.Input;
CL.LightBox.ControlPrototypes.Input.prototype.draw = function(on, stack)	{
	this.element.type = this.inputType
	this.element.placeholder = this.value
	this.element.name = this.name
	this.completeDraw(on, stack)
}
CL.LightBox.ControlPrototypes.Description = function(json)	{
	json = CL.Utils.checkJson(json, {type: "p"})
	CL.LightBox.ControlPrototype.call(this, json)
}
CL.Utils.extend(CL.LightBox.ControlPrototypes.Description)
CL.LightBox.ControlPrototypes.Description.prototype.draw = function(on, stack)	{
	this.element.innerHTML = this.value;
	this.completeDraw(on, stack)
}
CL.LightBox.ControlPrototypes.Description.prototype.modify = function(what, to, stack)	{
	elem = CL.Utils.prototypeStack(this, stack)
	this.element.innerHTML = this.value
	elem.prototypeParent.modify.call(this, what, to, stack + 1)
}
CL.LightBox.ControlPrototypes.Password = function(json)	{
	json = CL.Utils.checkJson(json)
	CL.LightBox.ControlPrototypes.Input.call(this, json)
	this.inputType = "password"
}
CL.Utils.extend(CL.LightBox.ControlPrototypes.Password, CL.LightBox.ControlPrototypes.Input)
CL.LightBox.ControlPrototypes.Form = function(json)	{
	json = CL.Utils.checkJson(json, {type: "form"})
	CL.LightBox.ControlPrototype.call(this, json)
	this.isJSHandled = json.isJSHandled ? 1 : 0
	this.action = json.action ? json.action : function(e) { e.preventDefault() }
	this.method = json.method ? json.method : "GET"
}
CL.Utils.extend(CL.LightBox.ControlPrototypes.Form)
CL.LightBox.ControlPrototypes.Form.prototype.draw = function(on, stack)	{
	if (this.isJSHandled)	this.element.onsubmit = function(e) { e.preventDefault(); this.action(); return false  }.bind(this)
	this.element.method = this.method
	this.completeDraw(on, stack)
}
CL.LightBox.ControlPrototypes.Submit = function(json)	{
	json = CL.Utils.checkJson(json, {type: "form"})
	CL.LightBox.ControlPrototypes.Input.call(this, json)
	this.inputType = "submit"
}
CL.Utils.extend(CL.LightBox.ControlPrototypes.Submit, CL.LightBox.ControlPrototypes.Input)
CL.LightBox.ControlPrototypes.Submit.prototype.draw = function(on, stack)	{
	this.element.value = this.value;
	this.completeDraw(on, stack)
}
CL.LightBox.getController = function(type, args, ctrl)	{
	return CL.LightBox.ControlPrototypes[type] ? new CL.LightBox.ControlPrototypes[type](args, ctrl) : null;
}
lb = null