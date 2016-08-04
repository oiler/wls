export function buildHTML(params) {
    let data = params.json,
        config = params.config,
        fileName = params.fileName,
        args,
        output = '';
    const hdrPre = config.html.header.prefix,
          hdrSuf = config.html.header.suffix,
          subHdrPre = config.html.subhed.prefix,
          subHdrSuf = config.html.subhed.suffix,
          pre = config.html.output.prefix,
          suf = config.html.output.suffix;
    if (data.links) {
        // component header
        output += hdrPre + fileName + hdrSuf;
        Object.keys(data.links).forEach(function(key) {
            if (typeof data.links[key] === 'string') {
                if (data.links[key] === '') {
                    // sub headers
                    output += subHdrPre + key + subHdrSuf + '\n';
                } else {
                    // regular list item
                    output += pre + '<a href="' + data.links[key] + '">' + key + '</a>' + suf;
                }
                output += '\n';
            }
            if (typeof data.links[key] === 'object') {
                output += pre;
                Object.keys(data.links[key]).forEach(function(item, index, array) {
                    if (index === 0) {
                        // first of many items on a single row
                        output += '<a href="' + data.links[key][item] + '">' + item + '</a>';
                    } else {
                        // the rest of many items on a single row
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
