CL.LightBox = {
	lightBoxes: [],
	head: 0,
	create: function()	{
		i = CL.LightBox;
		i.lightBoxes[i.head] = new i.Box;
		return i.Box;
	},
	onModuleLoad: function()	{		
		CL.DynamicFileLoader.addLib("lightBoxStyle", CL.Framework.modulesDir + "res/lightbox/style.css")
	}
}
CL.LightBox.Box = function()	{
	controlls: []
}
CL.LightBox.ControlPrototype = function(type, id, value, ctrl)	{
	this.type = type?type:"p";
	this.id = id?id:"control-"+ctrl;
	this.value = value?value:"Random Control Value"
	this.ctrlid = ctrl;
	this.drawLocation = null;
	this.element = this.createElement();
}
CL.LightBox.ControlPrototype.prototype.prototypeParent = CL.LightBox.ControlPrototype.prototype;
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
CL.LightBox.ControlPrototype.prototype.updateElement = function(elem, on)	{
	console.log(this.element)
	if (!this.findElement())		this.drawLocation.appendChild(this.element)
}
CL.LightBox.ControlPrototype.prototype.updateDrawLocation = function(on)	{
	i = this.drawLocation;
	this.drawLocation = on;
	if (i)		this.element.parentNode.removeChild(this.element)
}
CL.LightBox.ControlPrototype.prototype.draw = function(on)	{
	if (!this.drawLocation || this.drawLocation != on)	this.updateDrawLocation(on);
	this.element = this.getElement()
	this.element.id = this.id
	this.updateElement(this.element)
}
CL.LightBox.ControlPrototype.prototype.modify = function(what, to)	{
	console.log(what, to, this)
	this[what] = to;
	if (this.drawLocation) this.draw(this.drawLocation)
}
CL.LightBox.ControlPrototype.inherit = function(who, what)	{
	who.prototype = new (typeof(what) != "undefined" ? what : CL.LightBox.ControlPrototype)();
	who.prototype.constructor = who;
}
CL.LightBox.ControlPrototypes = {}
CL.LightBox.ControlPrototypes.Input = function(id, name, placeholder, ctrl)	{
	CL.LightBox.ControlPrototype.call(this, "input", placeholder, ctrl)
	this.name = name?name:this.id
	this.inputType = "text"
}
CL.LightBox.ControlPrototypes.Input.prototype = new CL.LightBox.ControlPrototype();
CL.LightBox.ControlPrototypes.Input.prototype.constructor = CL.LightBox.ControlPrototypes.Input;
CL.LightBox.ControlPrototypes.Input.prototype.draw = function(on)	{
	console.log(this)
	this.element.type = this.inputType
	this.element.placeholder = this.value
	this.element.name = this.name
	this.prototypeParent.draw.call(this, on);
}
CL.LightBox.ControlPrototypes.Description = function(id, value, ctrl)	{
	CL.LightBox.ControlPrototype.call(this, "p", id, value, ctrl)
}
CL.LightBox.ControlPrototype.inherit(CL.LightBox.ControlPrototypes.Description)
CL.LightBox.ControlPrototypes.Description.prototype.draw = function(on)	{
	this.element.innerHTML = this.value;
	this.prototypeParent.draw.call(this, on)
}
CL.LightBox.ControlPrototypes.Description.prototype.modify = function(what, to)	{
	this.prototypeParent.modify.call(this, what, to)
	this.element.innerHTML = this.value
}
CL.LightBox.ControlPrototypes.Password = function(id, value, ctrl)	{
	CL.LightBox.ControlPrototypes.Input.call(this, "input", id, value, ctrl)
	this.inputType = "password"
}
CL.LightBox.ControlPrototype.inherit(CL.LightBox.ControlPrototypes.Password, CL.LightBox.ControlPrototypes.Input)
CL.LightBox.Controlls = {
	"Input": CL.LightBox.ControlPrototypes.Input,
	"Description": CL.LightBox.ControlPrototypes.Description,
	"Password": CL.LightBox.ControlPrototypes.Password
}