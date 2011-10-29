CL.DynamicFileLoader = {
	addLib: function(name, location)	{
		CL.DynamicFileLoader.queue[CL.DynamicFileLoader.qh] = {
			type: location.substr(location.lastIndexOf(".") + 1),
			src: location,
			name: name
		}
		CL.DynamicFileLoader.qh++;
	},
	head: document.head,
	qh: 0,
    queue: [],
    working: 0,
    loadLibs: function(){
        for(c in css) {
            CL.DynamicFileLoader.queue[CL.DynamicFileLoader.qh] = {
                type: "css",
                src: css[c],
                name: c   
            }
            CL.DynamicFileLoader.qh++;
        }
        for(lib in libs) {
            CL.DynamicFileLoader.queue[CL.DynamicFileLoader.qh] = {
                type: "js",
                src: libs[lib],
                name: lib   
            }
            CL.DynamicFileLoader.qh++;
        }
        CL.DynamicFileLoader.processQueue();
        CL.DynamicFileLoader.loadCompleted();
    },
    processQueue: function(callback, fcb)   {
        if(!CL.DynamicFileLoader.working && CL.DynamicFileLoader.hasLibs()){
            CL.DynamicFileLoader.working = 1;
			f = CL.DynamicFileLoader.qh == 1 ? callback : CL.DynamicFileLoader.nullFunc;	
			CL.DynamicFileLoader.cases[CL.DynamicFileLoader.queue[0].type.toLowerCase()](f, fcb)
            CL.DynamicFileLoader.head.appendChild(script);
            CL.DynamicFileLoader.queue.splice(0, 1); 
			CL.DynamicFileLoader.qh--;
        } 
        if (CL.DynamicFileLoader.hasLibs()) setTimeout("CL.DynamicFileLoader.processQueue()", 50);
    },
	cases: {
		css: function( term, fcb ){        
				name = typeof(name) != "undefined" ? name : CL.DynamicFileLoader.queue[0].name;
				url = typeof(url) != "undefined" ? url : CL.DynamicFileLoader.queue[0].src;
	            script = document.createElement("link");
	            script.type = 'text/css';
	            script.id = name;
	            script.media = name;
	            script.rel = "stylesheet";
	            script.href = ((url.indexOf("http") < 0) ? "http://" + window.location.hostname : "") + url;
	            CL.DynamicFileLoader.working = 0;
				f(fcb)
	            return script;
	    },
	    js: function( term, fcb ){        
	            script = document.createElement("script");
	            script.type = 'text/javascript';
	            script.onload = function()  {
	                CL.DynamicFileLoader.working = 0;
	                CL.DynamicFileLoader.head.removeChild(this);
					f(fcb)
	            }
	            script.id = CL.DynamicFileLoader.queue[0].name;
	            script.src = ((CL.DynamicFileLoader.queue[0].src.indexOf("http") < 0) ? "http://" + window.location.hostname : "") + CL.DynamicFileLoader.queue[0].src;
	            return script;
	    },
	},
    hasLibs: function() {
        return CL.DynamicFileLoader.qh;
    },
	nullFunc: function() {}
}