CL.DynamicFileLoader = {
	addLib: function(json)	{
		CL.DynamicFileLoader.queue[CL.DynamicFileLoader.qh] = {
			type: json.location.substr(json.location.lastIndexOf(".") + 1),
			src: json.location,
			name: json.name,
			allData: json
		}
		CL.DynamicFileLoader.qh++;
	},
	head: document.head,
	qh: 0,
    queue: [],
	afterLoad: null,
    processQueue: function(callback)   {
		callback = typeof(callback) == "function" ? callback: CL.DynamicFileLoader.nullFunc;
		this.afterLoad = callback;
		this.loadQueue();
    },
	loadQueue: function()	{
		if(CL.DynamicFileLoader.hasLibs()){
			type = CL.DynamicFileLoader.queue[0].type.toLowerCase()
			callback = CL.DynamicFileLoader.qh == 1 ? CL.DynamicFileLoader.afterLoad : CL.DynamicFileLoader.loadQueue;
			CL.DynamicFileLoader.cases[type](callback)
            CL.DynamicFileLoader.head.appendChild(script);
            CL.DynamicFileLoader.queue.splice(0, 1); 
			CL.DynamicFileLoader.qh--;
			if (!CL.DynamicFileLoader.aSyncCases[type]) callback(callback)
        }
	},
	aSyncCases: {
		css: 0,
		js: 1
	},
	cases: {
		css: function( term ){        
				name = CL.DynamicFileLoader.queue[0].name;
				url = CL.DynamicFileLoader.queue[0].src;
				media = CL.DynamicFileLoader.queue[0].allData.media;
	            script = document.createElement("link");
	            script.type = 'text/css';
	            script.id = name;
	            script.media = media;
	            script.rel = "stylesheet";
                if(typeof(CL.Framework.runningNativeMode) == "undefined")   baseURL = "";        
                else baseURL = ((url.indexOf("http") < 0) ? "http://" + window.location.hostname : "");
	            script.href = baseURL + url;
	            CL.DynamicFileLoader.working = 0;
	            return script;
	    },
	    js: function( term ){        
	            script = document.createElement("script");
	            script.type = 'text/javascript';
	            script.onload = function()  {
	                CL.DynamicFileLoader.head.removeChild(this);
					term()
	            }
	            script.id = CL.DynamicFileLoader.queue[0].name;
                if(typeof(CL.Framework.runningNativeMode) == "undefined")   baseURL = "";        
                else baseURL = ((CL.DynamicFileLoader.queue[0].src.indexOf("http") < 0) ? "http://" + window.location.hostname : "");
	            script.src = baseURL + CL.DynamicFileLoader.queue[0].src;
	            return script;
	    },
	},
    hasLibs: function() {
        return CL.DynamicFileLoader.qh;
    },
	nullFunc: function() {}
}
