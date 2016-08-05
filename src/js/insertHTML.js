import {buildHTML} from './buildHTML.js';

export function insertHTML(params) {
    let config = params.config,
        json,
        fileName,
        element,
        html,
        args = {};
    if (params.json) {
        json = params.json,
        fileName = params.fileName;
    }
    if (params.options) {
        json = params.options,
        fileName = 'side';
    }
    html = buildHTML(args = {json, config, fileName});
    element = document.getElementById(fileName);
    element.innerHTML = html;
    // } else {
    //     isError = true;
    //     logError('json was empty');
}
