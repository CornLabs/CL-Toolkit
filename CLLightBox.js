CL.LightBox = {
	lightBoxes: [],
	head: 0,
	create: function()	{
		i = CL.LightBox;
		i.lightBoxes[i.head] = new i.Box(i.head);
		return i.lightBoxes[i.head];
	},
	onModuleLoad: function()	{	
		CL.DynamicFileLoader.addLib({"id": "lightBoxStyle", "location": CL.Framework.modulesDir + "res/lightbox.css", "media": "screen"})
		CL.DynamicFileLoader.processQueue()
	}
}
lb = CL.LightBox
CL.LightBox.Box = function(ctrl)	{
	this.ctrlid = ctrl;
	this.element = document.createElement("div")
	this.element.className="lightboxWrapper"
	this.element.id = "lightbox-"+ctrl
	this.hasElement = true

	this.controlls = []
}
CL.LightBox.Box.prototype.show = function()	{
	document.body.appendChild(this.element)
	this.element.innerHTML = "MERGE"
	CL.LightBox.Utils.animate(this.element, [
		{"property": "background-color", "from": 0, "to": 0.8, "string": "rgba(0, 0, 0, $#value#$)"}, 
		{"property": "color", "from": 0, "to": 255, "string": "rgb($#value#$, $#value#$, $#value#$)"},
	], 150, function()	{
		console.log("done anim first")
		CL.LightBox.Utils.animate(this.element, [
			{"property": "font-size", "from": 10, "to": 192, "string": "$#value#$px"},			
			{"property": "color", "from": 255, "downto": 50, "string": "rgb($#value#$, $#value * 3#$, 255)"}
		], 400)
	}.bind(this) )
}
CL.LightBox.Utils = {
	checkJson: function(json, alt)	{
		json = json ? json : {}
		for ( item in alt )	json[item] = alt[item]
		return json ? json : {}
	},
	extend: function( who, what )	{		
		who.prototype = new (typeof(what) != "undefined" ? what : CL.LightBox.ControlPrototype)();
		who.prototype.constructor = who;
	},
	animate: function( object, properties, time, callback, tick )	{
		callback = callback ? callback : function() { return null }
		tick = tick ? tick : 1
		if (!properties.length && properties)	properties = [properties]
		percent = tick / time
		for( p in properties )	{
			p = properties[p]
			value = p.to ? (p.to - p.from) * percent : p.from - (p.from - p.downto) * percent
			if (p.property == "color")	console.log(value)
			output = value;
			if (typeof(p.string) != "undefined")	{
				output = p.string;
				while (output.indexOf("$#") != -1)	{
					start = output.indexOf("$#") + 2
					end = output.indexOf("#$", start)
					substr = output.substring(start, end)
					output = output.replace("$#" + substr + "#$", eval(substr))
				}
			}	
			object.style[p.property] = output
		}
		if (tick <= time) setTimeout(function(){CL.LightBox.Utils.animate(object, properties, time, callback, tick + 1)}, 1)
		else 	callback()	
	}
}
head=0
CL.LightBox.ControlPrototype = function(json)	{
	json = CL.LightBox.Utils.checkJson(json)
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
	console.log(this)
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
	console.log(this)
	this.updateElement(this.element)
}
CL.LightBox.ControlPrototype.prototype.modify = function(what, to)	{
	this[what] = to;
	if (this.drawLocation) this.draw(this.drawLocation)
}
CL.LightBox.ControlPrototype.prototype.completeDraw = function(on, stack)	{
	stack = stack?stack:0
	elem = this.prototypeParent
	for(i = 0; i < stack; i++ 	)	elem = elem.prototypeParent
	console.log(elem)
	return elem.draw.call(this, on, stack + 1)
}
CL.LightBox.ControlPrototypes = {}
CL.LightBox.ControlPrototypes.Input = function(json)	{
	json = CL.LightBox.Utils.checkJson(json, {type: "input"})
	CL.LightBox.ControlPrototype.call(this, json)
	this.name = json.name?json.name:this.id
	this.inputType = "text"
}
CL.LightBox.ControlPrototypes.Input.prototype = new CL.LightBox.ControlPrototype();
CL.LightBox.ControlPrototypes.Input.prototype.constructor = CL.LightBox.ControlPrototypes.Input;
CL.LightBox.ControlPrototypes.Input.prototype.draw = function(on, stack)	{
	console.log(this)
	this.element.type = this.inputType
	this.element.placeholder = this.value
	this.element.name = this.name
	this.completeDraw(on, stack)
}
CL.LightBox.ControlPrototypes.Description = function(json)	{
	json = CL.LightBox.Utils.checkJson(json, {type: "p"})
	CL.LightBox.ControlPrototype.call(this, json)
}
CL.LightBox.Utils.extend(CL.LightBox.ControlPrototypes.Description)
CL.LightBox.ControlPrototypes.Description.prototype.draw = function(on, stack)	{
	this.element.innerHTML = this.value;
	this.completeDraw(on, stack)
}
CL.LightBox.ControlPrototypes.Description.prototype.modify = function(what, to)	{
	this.prototypeParent.modify.call(this, what, to)
	this.element.innerHTML = this.value
}
CL.LightBox.ControlPrototypes.Password = function(json)	{
	json = CL.LightBox.Utils.checkJson(json)
	CL.LightBox.ControlPrototypes.Input.call(this, json)
	this.inputType = "password"
}
CL.LightBox.Utils.extend(CL.LightBox.ControlPrototypes.Password, CL.LightBox.ControlPrototypes.Input)
CL.LightBox.ControlPrototypes.Form = function(json)	{
	json = CL.LightBox.Utils.checkJson(json, {type: "form"})
	CL.LightBox.ControlPrototype.call(this, json)
	this.isJSHandled = json.isJSHandled ? 1 : 0
	this.action = json.action ? eval(json.action) : function(e) { e.preventDefault() }
	this.method = json.method ? json.method : "GET"
}
CL.LightBox.Utils.extend(CL.LightBox.ControlPrototypes.Form)
CL.LightBox.ControlPrototypes.Form.prototype.draw = function(on, stack)	{
	if (this.isJSHandled)	this.element.onsubmit = this.action
	this.element.method = this.method
	this.completeDraw(on, stack)
}
CL.LightBox.ControlPrototypes.Submit = function(json)	{
	json = CL.LightBox.Utils.checkJson(json, {type: "form"})
	CL.LightBox.ControlPrototypes.Input.call(this, json)
	this.inputType = "submit"
}
CL.LightBox.Utils.extend(CL.LightBox.ControlPrototypes.Submit, CL.LightBox.ControlPrototypes.Input)
CL.LightBox.ControlPrototypes.Submit.prototype.draw = function(on, stack)	{
	this.element.value = this.value;
	this.completeDraw(on, stack)
}
CL.LightBox.getController = function(type, args)	{
	return CL.LightBox.ControlPrototypes[type] ? new CL.LightBox.ControlPrototypes[type](args) : null;
}
lb = null