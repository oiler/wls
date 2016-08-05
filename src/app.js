// initialize
function cl(i) {
    return console.log(i);
}

import {config}     from './js/config';
import {insertHTML} from './js/insertHTML';
import {getJSON}    from './js/getJSON';

let html = '',
    json,
    args,
    isError = false,
    wlsOrder = config.wlsOrder,
    wlsSide = config.wlsSide.default;
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
    // add base components as determined by config order
    Object.keys(wlsOrder).forEach(function(key, index) {
        parseComponent(args = {
            fileName: wlsOrder[key]
        });
    });
    // setMasonry();
    // add sidebar component
    buildWLSside();
    parseComponent(args = {
        fileName: wlsSide,
        parent: 'theside'
    });
}

// function setMasonry() {
//     var elem = document.querySelector('#content');
//     var msnry = new Masonry( elem, {
//       itemSelector: 'ul'
//     });
// }

function buildWLSside() {
    let options = {};
    options = config.wlsSide;
    //console.log(data);
    insertHTML(args = {
        options, config
    });
}

initWLS();

/* todo
set side toggle
is no masonry ok
start css
*/