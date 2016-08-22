import {insertHTML} from './insertHTML.js';

export function buildWLSside(params) {
    let config = params.config,
        options = config.wlsSide,
        args,
        parent = document.getElementById('theside'),
        child = document.createElement('ul');
        child.id = config.wlsSide.default;
    parent.appendChild(child);
    insertHTML(args = {options, config});
}
