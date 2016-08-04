import {buildHTML} from './buildHTML.js';

export function insertHTML(params) {
    let json = params.json,
        args;
    if (json) {
        let fileName = params.fileName,
            config = params.config,
            element,
            html,
            parent = document.getElementById(params.parent),
            child = document.createElement('ul');
        html = buildHTML(args = {json, config, fileName})
        child.id = fileName;
        parent.appendChild(child);
        element = document.getElementById(child.id);
        element.innerHTML = html;
    // } else {
    //     isError = true;
    //     logError('json was empty');
    }
}
