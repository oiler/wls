import {insertHTML} from './insertHTML.js';

export function buildWLSside(params) {
    let config = params.config,
        options = config.wlsSide,
        args,
        fileName,
        parent = document.getElementById('theside'),
        child = document.createElement('ul');
    fileName = (params.fileName) ? params.fileName : config.wlsSide.default;
    child.id = fileName;
    parent.appendChild(child);
    insertHTML(args = {options, config});
}
