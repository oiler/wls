import {buildHTML} from './buildHTML.js';

export function insertHTML(params) {
    let config = params.config,
        json,
        fileName,
        parent,
        child,
        element,
        html,
        args = {};
    if (params.json) {
        json = params.json,
        fileName = params.fileName,
        parent = document.getElementById(params.parent),
        child = document.createElement('ul');
    }
    if (params.options) {
        json = params.options,
        fileName = 'side',
        parent = document.getElementById('content'),
        child = document.createElement('ul');
    }
//    console.log(fileName, json);
    html = buildHTML(args = {json, config, fileName})
    child.id = fileName;
    parent.appendChild(child);
    element = document.getElementById(child.id);
    element.innerHTML = html;
    // } else {
    //     isError = true;
    //     logError('json was empty');
}
