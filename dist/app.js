(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var config = require("./js/config").config;

var buildWLSside = require("./js/buildWLSside").buildWLSside;

var parseComponent = require("./js/parseComponent").parseComponent;

var listenForClicks = require("./js/listenForClicks").listenForClicks;

var html = "",
    json = undefined,
    args = undefined,
    isError = false,
    wlsOrder = config.wlsOrder;

function initWLS() {
    // add base components as determined by config order
    Object.keys(wlsOrder).forEach(function (key, index, array) {
        if (wlsOrder[key] === "side") {
            var _parent = document.getElementById("theside"),
                child = document.createElement("ul");
            child.id = config.wlsSide["default"];
            // todo make sure side default comp is not in array of regular order
            _parent.appendChild(child);
            buildWLSside(args = { config: config });
            parseComponent(args = { fileName: config.wlsSide["default"], parent: "theside", config: config });
            listenForClicks(args = { className: "sidelinks", config: config });
        } else {
            // order is important so we create our dom elements here to preserve order
            var _parent2 = document.getElementById("content"),
                child = document.createElement("ul");
            child.id = wlsOrder[key];
            _parent2.appendChild(child);
            parseComponent(args = { fileName: wlsOrder[key], config: config });
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

},{"./js/buildWLSside":3,"./js/config":4,"./js/listenForClicks":7,"./js/parseComponent":8}],2:[function(require,module,exports){
"use strict";

exports.buildHTML = buildHTML;
Object.defineProperty(exports, "__esModule", {
    value: true
});

function buildHTML(params) {

    var data = params.json,
        config = params.config,
        fileName = params.fileName,
        args = undefined,
        output = "";

    var hdrPre = config.html.header.prefix,
        hdrSuf = config.html.header.suffix,
        subHdrPre = config.html.subhed.prefix,
        subHdrSuf = config.html.subhed.suffix,
        pre = config.html.output.prefix,
        suf = config.html.output.suffix;

    // component header
    output += hdrPre + fileName + hdrSuf;

    if (data.options) {
        Object.keys(data.options).forEach(function (key, index) {
            output += pre + "<a class=\"sidelinks\" target=\"_blank\" href=\"\">" + data.options[key] + "</a>" + suf;
            output += "\n";
        });
        return output;
    }

    if (data.links) {
        Object.keys(data.links).forEach(function (key) {
            if (typeof data.links[key] === "string") {
                if (data.links[key] === "") {
                    // sub headers
                    output += subHdrPre + key + subHdrSuf + "\n";
                } else {
                    // regular list item
                    output += pre + "<a target=\"_blank\" href=\"" + data.links[key] + "\">" + key + "</a>" + suf;
                }
                output += "\n";
            }
            if (typeof data.links[key] === "object") {
                output += pre;
                Object.keys(data.links[key]).forEach(function (item, index, array) {
                    if (index === 0) {
                        // first of many items on a single row
                        output += "<a target=\"_blank\" href=\"" + data.links[key][item] + "\">" + item + "</a>";
                    } else {
                        // the rest of many items on a single row
                        output += " - <a target=\"_blank\" href=\"" + data.links[key][item] + "\">" + item.substring(0, 1) + "</a>";
                    }
                });
                output += "\n";
                output += suf;
            }
        });
        return output;
    }
}

},{}],3:[function(require,module,exports){
"use strict";

exports.buildWLSside = buildWLSside;
Object.defineProperty(exports, "__esModule", {
    value: true
});

var insertHTML = require("./insertHTML.js").insertHTML;

function buildWLSside(params) {
    var config = params.config,
        options = config.wlsSide,
        args = undefined;
    insertHTML(args = { options: options, config: config });
}

},{"./insertHTML.js":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    html: {
        output: {
            prefix: "<li>",
            suffix: "</li>"
        },
        header: {
            prefix: "<h2>",
            suffix: "</h2>"
        },
        subhed: {
            prefix: "<h3>",
            suffix: "</h3>"
        }
    },
    wlsOrder: ["hockey", "baseball", "football", "google", "digital", "stream", "other", "side"],
    wlsSide: {
        fileName: "side",
        "default": "bp",
        options: ["bp", "tnr", "dev2", "js", "wp", "mlb", "matchup"]
    },
    data: {
        baseDir: "./src/data/",
        fileExt: ".json"
    }
};
exports.config = config;

},{}],5:[function(require,module,exports){
"use strict";

exports.getJSON = getJSON;
Object.defineProperty(exports, "__esModule", {
    value: true
});

function getJSON(params) {
    var callback = params.callback,
        args = undefined;
    fetch(params.file).then(function (response) {
        return response.json();
    }).then(function (json) {
        args = params;
        args.json = json;
        callback(args);
    });
}

},{}],6:[function(require,module,exports){
"use strict";

exports.insertHTML = insertHTML;
Object.defineProperty(exports, "__esModule", {
    value: true
});

var buildHTML = require("./buildHTML.js").buildHTML;

function insertHTML(params) {
    var config = params.config,
        json = undefined,
        fileName = undefined,
        element = undefined,
        html = undefined,
        args = {};
    if (params.json) {
        json = params.json, fileName = params.fileName;
    }
    if (params.options) {
        json = params.options, fileName = config.wlsSide.fileName;
    }
    html = buildHTML(args = { json: json, config: config, fileName: fileName });
    element = document.getElementById(fileName);
    console.log(fileName, element);
    element.innerHTML = html;
}

},{"./buildHTML.js":2}],7:[function(require,module,exports){
"use strict";

exports.listenForClicks = listenForClicks;
Object.defineProperty(exports, "__esModule", {
    value: true
});

var getJSON = require("./getJSON.js").getJSON;

var insertHTML = require("./insertHTML.js").insertHTML;

var parseComponent = require("./parseComponent.js").parseComponent;

function listenForClicks(params) {
    var className = params.className,
        linksToClick = document.getElementsByClassName(className),
        config = params.config,
        args = undefined;
    for (var i = 0; i < linksToClick.length; i++) {
        linksToClick[i].addEventListener("click", function (ev) {
            ev.preventDefault();
            var thisFileName = this.textContent,
                parent = document.getElementById("theside"),
                child = document.createElement("ul");
            parent.innerHTML = "";
            child.id = thisFileName;
            parent.appendChild(child);
            parseComponent(args = { fileName: thisFileName, parent: "theside", config: config, getJSON: getJSON, insertHTML: insertHTML });
        }, false);
    }
}

},{"./getJSON.js":5,"./insertHTML.js":6,"./parseComponent.js":8}],8:[function(require,module,exports){
"use strict";

exports.parseComponent = parseComponent;
Object.defineProperty(exports, "__esModule", {
    value: true
});

var getJSON = require("./getJSON.js").getJSON;

var insertHTML = require("./insertHTML.js").insertHTML;

function parseComponent(params) {
    var config = params.config,
        fileName = params.fileName,
        parent = params.parent ? params.parent : "content",
        file = config.data.baseDir + fileName + config.data.fileExt,
        args = undefined;
    getJSON(args = {
        fileName: fileName,
        file: file,
        callback: insertHTML,
        parent: parent,
        config: config
    });
}

},{"./getJSON.js":5,"./insertHTML.js":6}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvYXBwLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2J1aWxkSFRNTC5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9idWlsZFdMU3NpZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvY29uZmlnLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2dldEpTT04uanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvaW5zZXJ0SFRNTC5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9saXN0ZW5Gb3JDbGlja3MuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvcGFyc2VDb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztJQ0FRLE1BQU0sV0FBbUIsYUFBYSxFQUF0QyxNQUFNOztJQUNOLFlBQVksV0FBYSxtQkFBbUIsRUFBNUMsWUFBWTs7SUFDWixjQUFjLFdBQVcscUJBQXFCLEVBQTlDLGNBQWM7O0lBQ2QsZUFBZSxXQUFVLHNCQUFzQixFQUEvQyxlQUFlOztBQUV2QixJQUFJLElBQUksR0FBRyxFQUFFO0lBQ1QsSUFBSSxZQUFBO0lBQ0osSUFBSSxZQUFBO0lBQ0osT0FBTyxHQUFHLEtBQUs7SUFDZixRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FDekI7O0FBRUwsU0FBUyxPQUFPLEdBQUc7O0FBRWYsVUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxHQUFHLEVBQUUsS0FBSyxF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eEIsa0JBQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUIsMEJBQWMsQ0FBQyxJQUFJLEdBQUcsRUFBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUMsQ0FBQyxDQUFDO1NBQ25HLEVBQ0QsS0FBSyxDQUNSLENBQUM7S0FDTDtDQUNKOzs7OztRQ3RCZSxjQUFjLEdBQWQsY0FBYzs7Ozs7SUFIdEIsT0FBTyxXQUFPLGNBQWMsRUFBNUIsT0FBTzs7SUFDUCxVQUFVLFdBQU8saUJBQWlCLEVBQWxDLFVBQVU7O0FBRVgsU0FBUyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQ25DLFFBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNO1FBQ3RCLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUTtRQUMxQixNQUFNLEdBQUcsQUFBQyxNQUFNLENBQUMsTUFBTSxHQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUztRQUNwRCxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTztRQUMzRCxJQUFJLFlBQUEsQ0FBQztBQUNULFdBQU8sQ0FBQyxJQUFJLEdBQUc7QUFDWCxnQkFBUSxFQUFSLFFBQVE7QUFDUixZQUFJLEVBQUosSUFBSTtBQUNKLGdCQUFRLEVBQUUsVUFBVTtBQUNwQixjQUFNLEVBQU4sTUFBTTtBQUNOLGNBQU0sRUFBTixNQUFNO0tBQ1QsQ0FBQyxDQUFDO0NBQ04iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtjb25maWd9ICAgICAgICAgICAgIGZyb20gJy4vanMvY29uZmlnJztcbmltcG9ydCB7YnVpbGRXTFNzaWRlfSAgICAgICBmcm9tICcuL2pzL2J1aWxkV0xTc2lkZSc7XG5pbXBvcnQge3BhcnNlQ29tcG9uZW50fSAgICAgZnJvbSAnLi9qcy9wYXJzZUNvbXBvbmVudCc7XG5pbXBvcnQge2xpc3RlbkZvckNsaWNrc30gICAgZnJvbSAnLi9qcy9saXN0ZW5Gb3JDbGlja3MnO1xuXG5sZXQgaHRtbCA9ICcnLFxuICAgIGpzb24sXG4gICAgYXJncyxcbiAgICBpc0Vycm9yID0gZmFsc2UsXG4gICAgd2xzT3JkZXIgPSBjb25maWcud2xzT3JkZXJcbiAgICA7XG5cbmZ1bmN0aW9uIGluaXRXTFMoKSB7XG4gICAgLy8gYWRkIGJhc2UgY29tcG9uZW50cyBhcyBkZXRlcm1pbmVkIGJ5IGNvbmZpZyBvcmRlclxuICAgIE9iamVjdC5rZXlzKHdsc09yZGVyKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgIGlmICh3bHNPcmRlcltrZXldID09PSAnc2lkZScpIHtcbiAgICAgICAgICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGhlc2lkZScpLFxuICAgICAgICAgICAgICAgIGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgIGNoaWxkLmlkID0gY29uZmlnLndsc1NpZGUuZGVmYXVsdDtcbiAgICAgICAgICAgIC8vIHRvZG8gbWFrZSBzdXJlIHNpZGUgZGVmYXVsdCBjb21wIGlzIG5vdCBpbiBhcnJheSBvZiByZWd1bGFyIG9yZGVyXG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgYnVpbGRXTFNzaWRlKGFyZ3MgPSB7Y29uZmlnfSk7XG4gICAgICAgICAgICBwYXJzZUNvbXBvbmVudChhcmdzID0ge2ZpbGVOYW1lOiBjb25maWcud2xzU2lkZS5kZWZhdWx0LCBwYXJlbnQ6ICd0aGVzaWRlJywgY29uZmlnfSk7XG4gICAgICAgICAgICBsaXN0ZW5Gb3JDbGlja3MoYXJncyA9IHtjbGFzc05hbWU6ICdzaWRlbGlua3MnLCBjb25maWd9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG9yZGVyIGlzIGltcG9ydGFudCBzbyB3ZSBjcmVhdGUgb3VyIGRvbSBlbGVtZW50cyBoZXJlIHRvIHByZXNlcnZlIG9yZGVyXG4gICAgICAgICAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSxcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgICBjaGlsZC5pZCA9IHdsc09yZGVyW2tleV07XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgcGFyc2VDb21wb25lbnQoYXJncyA9IHtmaWxlTmFtZTogd2xzT3JkZXJba2V5XSwgY29uZmlnfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuaW5pdFdMUygpO1xuXG4vKiB0b2RvXG5zdGFydCBuZXcgY3NzIGJ1aWxkXG5zZXJ2aWNlIHdvcmtlclxuLy9nZXQgcmlkIG9mICMgb25jbGlja1xuLy9vcGVuIGxpbmtzIGluIG5ldyB0YWJzXG4vL3NldCBzaWRlIHRvZ2dsZVxuZW5oYW5jZW1lbnRzOlxuYWRkIG1hc29ucnkgb3B0aW9uOiBvbmx5IGxvYWQgaW4gZGVza3RvcCwgdHVybiBvbi9vZmYsIGtlZXAgb24gZm9yIGFsbCBkZXZpY2VzLCBjc3MgbWFzb25yeSAoaHR0cDovL3czYml0cy5jb20vY3NzLW1hc29ucnkvKVxuY29ubmVjdCB0byBnc2hlZXQgdGFic1xubG9hZCBzaWRlIHZpYSB1cmwgcGFyYW1cbiovXG5cbi8vXG4vLyBmdW5jdGlvbiBzZXRNYXNvbnJ5KCkge1xuLy8gICAgIHZhciBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRlbnQnKTtcbi8vICAgICB2YXIgbXNucnkgPSBuZXcgTWFzb25yeSggZWxlbSwge1xuLy8gICAgICAgaXRlbVNlbGVjdG9yOiAndWwnXG4vLyAgICAgfSk7XG4vLyB9XG4iLCJleHBvcnQgZnVuY3Rpb24gYnVpbGRIVE1MKHBhcmFtcykge1xuXG4gICAgbGV0IGRhdGEgPSBwYXJhbXMuanNvbixcbiAgICAgICAgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAgZmlsZU5hbWUgPSBwYXJhbXMuZmlsZU5hbWUsXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIG91dHB1dCA9ICcnO1xuXG4gICAgY29uc3QgaGRyUHJlID0gY29uZmlnLmh0bWwuaGVhZGVyLnByZWZpeCxcbiAgICAgICAgICBoZHJTdWYgPSBjb25maWcuaHRtbC5oZWFkZXIuc3VmZml4LFxuICAgICAgICAgIHN1YkhkclByZSA9IGNvbmZpZy5odG1sLnN1YmhlZC5wcmVmaXgsXG4gICAgICAgICAgc3ViSGRyU3VmID0gY29uZmlnLmh0bWwuc3ViaGVkLnN1ZmZpeCxcbiAgICAgICAgICBwcmUgPSBjb25maWcuaHRtbC5vdXRwdXQucHJlZml4LFxuICAgICAgICAgIHN1ZiA9IGNvbmZpZy5odG1sLm91dHB1dC5zdWZmaXg7XG5cbiAgICAvLyBjb21wb25lbnQgaGVhZGVyXG4gICAgb3V0cHV0ICs9IGhkclByZSArIGZpbGVOYW1lICsgaGRyU3VmO1xuXG4gICAgaWYgKGRhdGEub3B0aW9ucykge1xuICAgICAgICBPYmplY3Qua2V5cyhkYXRhLm9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpbmRleCkge1xuICAgICAgICAgICAgb3V0cHV0ICs9IHByZSArICc8YSBjbGFzcz1cInNpZGVsaW5rc1wiIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJcIj4nICsgZGF0YS5vcHRpb25zW2tleV0gKyAnPC9hPicgKyBzdWY7XG4gICAgICAgICAgICBvdXRwdXQgKz0gJ1xcbic7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIGlmIChkYXRhLmxpbmtzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGRhdGEubGlua3MpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEubGlua3Nba2V5XSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5saW5rc1trZXldID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBzdWIgaGVhZGVyc1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gc3ViSGRyUHJlICsga2V5ICsgc3ViSGRyU3VmICsgJ1xcbic7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVndWxhciBsaXN0IGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHByZSArICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIGRhdGEubGlua3Nba2V5XSArICdcIj4nICsga2V5ICsgJzwvYT4nICsgc3VmO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ1xcbic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEubGlua3Nba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcHJlO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGRhdGEubGlua3Nba2V5XSkuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCwgYXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXJzdCBvZiBtYW55IGl0ZW1zIG9uIGEgc2luZ2xlIHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIGRhdGEubGlua3Nba2V5XVtpdGVtXSArICdcIj4nICsgaXRlbSArICc8L2E+JztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSByZXN0IG9mIG1hbnkgaXRlbXMgb24gYSBzaW5nbGUgcm93XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJyAtIDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgZGF0YS5saW5rc1trZXldW2l0ZW1dICsgJ1wiPicgKyBpdGVtLnN1YnN0cmluZygwLCAxKSArICc8L2E+JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSAnXFxuJztcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gc3VmO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7aW5zZXJ0SFRNTH0gZnJvbSAnLi9pbnNlcnRIVE1MLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkV0xTc2lkZShwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAgb3B0aW9ucyA9IGNvbmZpZy53bHNTaWRlLFxuICAgICAgICBhcmdzO1xuICAgIGluc2VydEhUTUwoYXJncyA9IHtvcHRpb25zLCBjb25maWd9KTtcbn1cbiIsImV4cG9ydCBsZXQgY29uZmlnID0ge1xuICAgIGh0bWw6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBwcmVmaXg6ICc8bGk+JyxcbiAgICAgICAgICAgIHN1ZmZpeDogJzwvbGk+J1xuICAgICAgICB9LFxuICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgIHByZWZpeDogJzxoMj4nLFxuICAgICAgICAgICAgc3VmZml4OiAnPC9oMj4nXG4gICAgICAgIH0sXG4gICAgICAgIHN1YmhlZDoge1xuICAgICAgICAgICAgcHJlZml4OiAnPGgzPicsXG4gICAgICAgICAgICBzdWZmaXg6ICc8L2gzPidcbiAgICAgICAgfVxuICAgIH0sXG4gICAgd2xzT3JkZXI6IFtcbiAgICAgICAgJ2hvY2tleScsXG4gICAgICAgICdiYXNlYmFsbCcsXG4gICAgICAgICdmb290YmFsbCcsXG4gICAgICAgICdnb29nbGUnLFxuICAgICAgICAnZGlnaXRhbCcsXG4gICAgICAgICdzdHJlYW0nLFxuICAgICAgICAnb3RoZXInLFxuICAgICAgICAnc2lkZSdcbiAgICBdLFxuICAgIHdsc1NpZGU6IHtcbiAgICAgICAgZmlsZU5hbWU6ICdzaWRlJyxcbiAgICAgICAgZGVmYXVsdDogJ2JwJyxcbiAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgICAgJ2JwJyxcbiAgICAgICAgICAgICd0bnInLFxuICAgICAgICAgICAgJ2RldjInLFxuICAgICAgICAgICAgJ2pzJyxcbiAgICAgICAgICAgICd3cCcsXG4gICAgICAgICAgICAnbWxiJyxcbiAgICAgICAgICAgICdtYXRjaHVwJ1xuICAgICAgICAgXVxuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgICBiYXNlRGlyOiAnLi9zcmMvZGF0YS8nLFxuICAgICAgICBmaWxlRXh0OiAnLmpzb24nXG4gICAgfSBcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0SlNPTihwYXJhbXMpIHtcbiAgICBsZXQgY2FsbGJhY2sgPSBwYXJhbXMuY2FsbGJhY2ssXG4gICAgICAgIGFyZ3M7XG4gICAgZmV0Y2gocGFyYW1zLmZpbGUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHsgXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgfSkudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgICAgIGFyZ3MgPSBwYXJhbXM7XG4gICAgICAgIGFyZ3MuanNvbiA9IGpzb247XG4gICAgICAgIGNhbGxiYWNrKGFyZ3MpO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtidWlsZEhUTUx9IGZyb20gJy4vYnVpbGRIVE1MLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluc2VydEhUTUwocGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIGpzb24sXG4gICAgICAgIGZpbGVOYW1lLFxuICAgICAgICBlbGVtZW50LFxuICAgICAgICBodG1sLFxuICAgICAgICBhcmdzID0ge307XG4gICAgaWYgKHBhcmFtcy5qc29uKSB7XG4gICAgICAgIGpzb24gPSBwYXJhbXMuanNvbixcbiAgICAgICAgZmlsZU5hbWUgPSBwYXJhbXMuZmlsZU5hbWU7XG4gICAgfVxuICAgIGlmIChwYXJhbXMub3B0aW9ucykge1xuICAgICAgICBqc29uID0gcGFyYW1zLm9wdGlvbnMsXG4gICAgICAgIGZpbGVOYW1lID0gY29uZmlnLndsc1NpZGUuZmlsZU5hbWU7XG4gICAgfVxuICAgIGh0bWwgPSBidWlsZEhUTUwoYXJncyA9IHtqc29uLCBjb25maWcsIGZpbGVOYW1lfSk7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZpbGVOYW1lKTtcbiAgICBjb25zb2xlLmxvZyhmaWxlTmFtZSwgZWxlbWVudCk7XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xufVxuIiwiaW1wb3J0IHtnZXRKU09OfSBmcm9tICcuL2dldEpTT04uanMnO1xuaW1wb3J0IHtpbnNlcnRIVE1MfSBmcm9tICcuL2luc2VydEhUTUwuanMnO1xuaW1wb3J0IHtwYXJzZUNvbXBvbmVudH0gZnJvbSAnLi9wYXJzZUNvbXBvbmVudC5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5Gb3JDbGlja3MocGFyYW1zKSB7XG4gICAgbGV0IGNsYXNzTmFtZSA9IHBhcmFtcy5jbGFzc05hbWUsXG4gICAgICAgIGxpbmtzVG9DbGljayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKSxcbiAgICAgICAgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAgYXJncztcbiAgICBmb3IgKHZhciBpPTA7IGk8bGlua3NUb0NsaWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxpbmtzVG9DbGlja1tpXS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgJ2NsaWNrJywgXG4gICAgICAgICAgICBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGV0IHRoaXNGaWxlTmFtZSA9IHRoaXMudGV4dENvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aGVzaWRlJyksXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgY2hpbGQuaWQgPSB0aGlzRmlsZU5hbWU7XG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgICAgICAgICBwYXJzZUNvbXBvbmVudChhcmdzID0ge2ZpbGVOYW1lOiB0aGlzRmlsZU5hbWUsIHBhcmVudDogJ3RoZXNpZGUnLCBjb25maWcsIGdldEpTT04sIGluc2VydEhUTUx9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7Z2V0SlNPTn0gZnJvbSAnLi9nZXRKU09OLmpzJztcbmltcG9ydCB7aW5zZXJ0SFRNTH0gZnJvbSAnLi9pbnNlcnRIVE1MLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ29tcG9uZW50KHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBmaWxlTmFtZSA9IHBhcmFtcy5maWxlTmFtZSxcbiAgICAgICAgcGFyZW50ID0gKHBhcmFtcy5wYXJlbnQpID8gcGFyYW1zLnBhcmVudCA6ICdjb250ZW50JyxcbiAgICAgICAgZmlsZSA9IGNvbmZpZy5kYXRhLmJhc2VEaXIgKyBmaWxlTmFtZSArIGNvbmZpZy5kYXRhLmZpbGVFeHQsXG4gICAgICAgIGFyZ3M7XG4gICAgZ2V0SlNPTihhcmdzID0ge1xuICAgICAgICBmaWxlTmFtZSwgXG4gICAgICAgIGZpbGUsIFxuICAgICAgICBjYWxsYmFjazogaW5zZXJ0SFRNTCxcbiAgICAgICAgcGFyZW50LCBcbiAgICAgICAgY29uZmlnXG4gICAgfSk7XG59XG4iXX0=
