function buildHTMLfrom(params) {
    let data = params.json,
        config = params.config,
        fileName = params.fileName,
        args,
        output = '';
    const hdrPre = config.html.header.prefix,
          hdrSuf = config.html.header.suffix, 
          pre = config.html.output.prefix,
          suf = config.html.output.suffix;
    if (data.links) {
        output += hdrPre + fileName + hdrSuf;
        Object.keys(data.links).forEach(function(key) {
            if (typeof data.links[key] === 'string') {
                output += pre + '<a href="' + data.links[key] + '">' + key + '</a>' + suf;
                output += '\n';
            }
            if (typeof data.links[key] === 'object') {
                output += pre;
                Object.keys(data.links[key]).forEach(function(item, index, array) {
                    if (index === 0) {
                        output += '<a href="' + data.links[key][item] + '">' + item + '</a>';
                    } else {
                        output += ' - <a href="' + data.links[key][item] + '">' + item.substring(0, 1) + '</a>';
                    }
                });
                output += '\n';
                output += suf;
            }
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
            html = buildHTMLfrom(args = {json, config, fileName}),
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
