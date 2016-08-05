import {config}             from './js/config';
import {getJSON}            from './js/getJSON';
import {insertHTML}         from './js/insertHTML';
import {buildWLSside}       from './js/buildWLSside';
import {parseComponent}     from './js/parseComponent';
import {listenForClicks}    from './js/listenForClicks';

let html = '',
    json,
    args,
    isError = false,
    wlsOrder = config.wlsOrder
    ;

function initWLS() {
    // add base components as determined by config order
    Object.keys(wlsOrder).forEach(function(key, index, array) {
        // order is important so we create our dom elements here to preserve order
        let parent = document.getElementById('content'),
            child = document.createElement('ul');
        child.id = wlsOrder[key];
        parent.appendChild(child);
        if (wlsOrder[key] !== 'side') {
            parseComponent(args = {fileName: wlsOrder[key], config, getJSON, insertHTML});
        } else {
            let parent = document.getElementById('theside'),
                child = document.createElement('ul');
            child.id = config.wlsSide.default;
            // todo if default is not in array of regular order
            parent.appendChild(child);
            buildWLSside(args = {config, insertHTML});
            parseComponent(args = {fileName: config.wlsSide.default, parent: 'theside', config, getJSON, insertHTML});
            listenForClicks(args = {className: 'sidelinks', parseComponent, config, getJSON, insertHTML});
        }
    });
}

initWLS();

/* todo
get rid of # onclick
open links in new tabs
//set side toggle
is no masonry ok
start new css
service worker
connect to gsheet tabs
*/

// function setMasonry() {
//     var elem = document.querySelector('#content');
//     var msnry = new Masonry( elem, {
//       itemSelector: 'ul'
//     });
// }
