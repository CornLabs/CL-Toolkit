CL.ShaderLoader = {
    loadFile: function(url, no, callback, errorCallback) {	    
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    callback(request.responseText, no)
                } else {
                    errorCallback(url);
                }
            }
        };
        request.send(null);    
    },
	
    loadFiles: function(urls, callback, errorCallback, GCB) {
        var numUrls = urls.length;
        var numComplete = 0;
        var result = [];

        function partialCallback(text, urlIndex) {
            result[result.length] = {}
            result[result.length-1].type = urls[urlIndex][1];
            result[result.length-1].text = text;
            result[result.length-1].url = urls[urlIndex][0];
	        
            numComplete++;
            if (numComplete == numUrls) {
                callback(result, GCB);
            }
        }
	
        for (i = 0; i < numUrls; i++) {
            CL.ShaderLoader.loadFile(urls[i][0], i, partialCallback, errorCallback);
        }
    },
    appendShaders: function(shaders, callback)	{
        for(shader in shaders)	{
            shader = shaders[shader]
            elem = document.createElement('script')
            url = shader.url;
            elem.id = url.substr(url.lastIndexOf("/") + 1)
            elem.innerHTML = shader.text;
            elem.type = shader.type
            document.head.appendChild(elem);
        }
        callback()
    }
}