// initialize
function cl(i) {
    return console.log(i);
}

import {config} from './js/config';
import {insertHTML} from './js/insertHTML';
import {getJSON} from './js/getJSON';

let html = '',
    json,
    args,
    isError = false,
    wlsOrder = config.wlsOrder,
    wlsSide = config.wlsSide;
    ;

function parseComponent(params) {
    let fileName = params.fileName;
    let parent = (params.parent) ? params.parent : 'content';
    let file = config.data.baseDir + fileName + config.data.fileExt;
    let args;
    getJSON(args = {
        fileName, 
        file, 
        callback: insertHTML, 
        parent, 
        config
    });
}

function initWLS() {
    Object.keys(wlsOrder).forEach(function(key) {
        parseComponent(args = {fileName: wlsOrder[key]});
    });
    parseComponent(args = {fileName: wlsSide, parent: 'side'});
}

initWLS();
