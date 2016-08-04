// initialize
function cl(i) {
    return console.log(i);
}

import {config} from './js/config';
import {getJSONfrom, insertHTMLfrom} from './js/buildFromJSON';

let html = '',
    json,
    args,
    isError = false,
    wlsOrder = config.wlsOrder,
    wlsSide = config.wlsSide;
    ;

function loopThroughWLSorder() {
    Object.keys(wlsOrder).forEach(function(key) {
        init(args = {fileName: wlsOrder[key]});
    });
}loopThroughWLSorder();

function doSide() {
    init(args = {fileName: wlsSide, parent: 'side'});
}doSide();

function init(params) {
    let fileName = params.fileName;
    let parent = (params.parent) ? params.parent : 'content';
    let file = 'http://repo/wls/src/data/' + fileName + '.json';
    let args;
    getJSONfrom(args = {fileName, file, callback: insertHTMLfrom, parent, config});
}

// init( args = {
//     fileName: 'js'
// });
