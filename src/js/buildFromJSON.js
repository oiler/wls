function buildHTMLfrom(params) {
    let data = params.json,
        config = params.config,
        args,
        output = '';
    const pre = config.html.output.prefix,
          suf = config.html.output.suffix;
    if (data.links) {
        Object.keys(data.links).forEach(function(key) {
            output += pre + '<a href="' + data.links[key] + '">' + key + '</a>' + suf;
            output += '\n';
        });
        return output;
    // } else {
    //     logError('data is empty');
    }
}

export function insertHTMLfrom(params) {
    let json = params.json,
        args;
    if (json) {
        let fileName = params.fileName,
            config = params.config,
            element,
            parent = document.getElementById(params.parent),
            html = buildHTMLfrom(args = {json, config}),
            child = document.createElement('ul');
        child.id = fileName;
        parent.appendChild(child);
        element = document.getElementById(child.id);
        element.innerHTML = html;
    // } else {
    //     isError = true;
    //     logError('json was empty');
    }
}

export function getJSONfrom(params) {
    let callback = params.callback,
        args;
    fetch(params.file).then(function(response) { 
        return response.json();
    }).then(function(json) {
        params.json = json;
        callback(args = params);
    });
}
