CL.Utils = {
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
		style = ""
		for( p in properties )	{
			p = properties[p]
			value = p.to ? (p.to - p.from) * percent : p.from - (p.from - p.downto) * percent
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
			style = style + p.property + ": " + output + "; "
		}
		object.setAttribute('style', style)
		if (tick <= time) setTimeout(function(){CL.Utils.animate(object, properties, time, callback, tick + 1)}, 1)
		else 	callback()	
	},
	prototypeStack: function(object, stack)	{
		stack = stack?stack:0
		elem = object;
		for(i = 1; i <= stack; i++)	elem = elem.__proto__
		return elem
	}
}