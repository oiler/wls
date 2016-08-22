import {config}             from './js/config';
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
        if (wlsOrder[key] === 'side') {
            let parent = document.getElementById('theside'),
                child = document.createElement('ul');
            child.id = config.wlsSide.default;
            // todo make sure side default comp is not in array of regular order
            parent.appendChild(child);
            buildWLSside(args = {config});
            parseComponent(args = {fileName: config.wlsSide.default, parent: 'theside', config});
            listenForClicks(args = {className: 'sidelinks', config});
        } else {
            // order is important so we create our dom elements here to preserve order
            let parent = document.getElementById('content'),
                child = document.createElement('ul');
            child.id = wlsOrder[key];
            parent.appendChild(child);
            parseComponent(args = {fileName: wlsOrder[key], config});
        }
    });
}

initWLS();

/* todo
start new css build
service worker
//get rid of # onclick
//open links in new tabs
//set side toggle
enhancements:
add masonry option: only load in desktop, turn on/off, keep on for all devices, css masonry (http://w3bits.com/css-masonry/)
connect to gsheet tabs
load side via url param
*/

//
// function setMasonry() {
//     var elem = document.querySelector('#content');
//     var msnry = new Masonry( elem, {
//       itemSelector: 'ul'
//     });
// }
