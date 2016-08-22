import {insertHTML} from './insertHTML.js';

export function buildWLSside(params) {
    let config = params.config,
        options = config.wlsSide,
        args;
    insertHTML(args = {options, config});
}
