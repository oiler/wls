import {config}             from '../data/config';
import {buildWLSside}       from './js/buildWLSside';
import {parseComponent}     from './js/parseComponent';
import {listenForClicks}    from './js/listenForClicks';
import {getParameterByName} from './js/getParameterByName';

let html = '',
    json,
    args,
    isError = false,
    wlsOrder = config.wlsOrder
    ;

function initWLS() {
    // add base components as determined by config order
    Object.keys(wlsOrder).forEach(function(key, index, array) {
        let parent = document.getElementById('content'),
            child = document.createElement('ul'),
            sideDefaultFileName;
        child.id = wlsOrder[key];
        parent.appendChild(child);
        if (wlsOrder[key] === 'side') {
            // todo make sure side default comp is not in array of regular order
            let preloadComponent = getParameterByName({key:'c'})
            if (preloadComponent) {
                // @todo: use [].filter here for input checking
                sideDefaultFileName = preloadComponent;
            } else {
                sideDefaultFileName = config.wlsSide.default;
            }
            buildWLSside(args = {fileName: sideDefaultFileName, config});
            parseComponent(args = {fileName: sideDefaultFileName, parent: 'theside', config});
            listenForClicks(args = {className: 'sidelinks', config});
        } else {
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
//load side via url param
*/

//
// function setMasonry() {
//     var elem = document.querySelector('#content');
//     var msnry = new Masonry( elem, {
//       itemSelector: 'ul'
//     });
// }
