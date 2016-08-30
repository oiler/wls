(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var config = require("../data/config").config;

var buildWLSside = require("./js/buildWLSside").buildWLSside;

var parseComponent = require("./js/parseComponent").parseComponent;

var listenForClicks = require("./js/listenForClicks").listenForClicks;

var getParameterByName = require("./js/getParameterByName").getParameterByName;

var html = "",
    json = undefined,
    args = undefined,
    isError = false,
    wlsOrder = config.wlsOrder;

function initWLS() {
    // add base components as determined by config order
    Object.keys(wlsOrder).forEach(function (key, index, array) {
        var parent = document.getElementById("content"),
            child = document.createElement("ul"),
            sideDefaultFileName = undefined;
        child.id = wlsOrder[key];
        parent.appendChild(child);
        if (wlsOrder[key] === "side") {
            // todo make sure side default comp is not in array of regular order
            var preloadComponent = getParameterByName({ key: "c" });
            if (preloadComponent) {
                // @todo: use [].filter here for input checking
                sideDefaultFileName = preloadComponent;
            } else {
                sideDefaultFileName = config.wlsSide["default"];
            }
            buildWLSside(args = { fileName: sideDefaultFileName, config: config });
            parseComponent(args = { fileName: sideDefaultFileName, parent: "theside", config: config });
            listenForClicks(args = { className: "sidelinks", config: config });
        } else {
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
//load side via url param
*/

//
// function setMasonry() {
//     var elem = document.querySelector('#content');
//     var msnry = new Masonry( elem, {
//       itemSelector: 'ul'
//     });
// }

},{"../data/config":2,"./js/buildWLSside":4,"./js/getParameterByName":6,"./js/listenForClicks":8,"./js/parseComponent":9}],2:[function(require,module,exports){
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
        options: ["bp", "tnr", "dev2", "js", "wp", "mlb", "travel", "money", "matchup mlb", "matchup cfb"]
    },
    data: {
        baseDir: "./data/",
        fileExt: ".json"
    }
};
exports.config = config;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";

exports.buildWLSside = buildWLSside;
Object.defineProperty(exports, "__esModule", {
    value: true
});

var insertHTML = require("./insertHTML.js").insertHTML;

function buildWLSside(params) {
    var config = params.config,
        options = config.wlsSide,
        args = undefined,
        fileName = undefined,
        parent = document.getElementById("theside"),
        child = document.createElement("ul");
    fileName = params.fileName ? params.fileName : config.wlsSide["default"];
    child.id = fileName;
    parent.appendChild(child);
    insertHTML(args = { options: options, config: config });
}

},{"./insertHTML.js":7}],5:[function(require,module,exports){
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

exports.getParameterByName = getParameterByName;
Object.defineProperty(exports, "__esModule", {
    value: true
});

function getParameterByName(params) {
    var key = undefined,
        url = undefined;
    key = params.key;
    url = params.url ? params.url : window.location.href;
    key = key.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + key + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) {
        return null;
    }if (!results[2]) {
        return "";
    }return decodeURIComponent(results[2].replace(/\+/g, " "));
}

},{}],7:[function(require,module,exports){
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
        json = params.options, fileName = "side";
    }
    html = buildHTML(args = { json: json, config: config, fileName: fileName });
    element = document.getElementById(fileName);
    //    console.log(fileName, element);
    element.innerHTML = html;
}

},{"./buildHTML.js":3}],8:[function(require,module,exports){
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

},{"./getJSON.js":5,"./insertHTML.js":7,"./parseComponent.js":9}],9:[function(require,module,exports){
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

},{"./getJSON.js":5,"./insertHTML.js":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvYXBwLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvZGF0YS9jb25maWcuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvYnVpbGRIVE1MLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2J1aWxkV0xTc2lkZS5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9nZXRKU09OLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2dldFBhcmFtZXRlckJ5TmFtZS5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9pbnNlcnRIVE1MLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2xpc3RlbkZvckNsaWNrcy5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9wYXJzZUNvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0lDQVEsTUFBTSxXQUFtQixnQkFBZ0IsRUFBekMsTUFBTTs7SUFDTixZQUFZLFdBQWEsbUJBQW1CLEVBQTVDLFlBQVk7O0lBQ1osY0FBYyxXQUFXLHFCQUFxQixFQUE5QyxjQUFjOztJQUNkLGVBQWUsV0FBVSxzQkFBc0IsRUFBL0MsZUFBZTs7SUFDZixrQkFBa0IsV0FBTyx5QkFBeUIsRUFBbEQsa0JBQWtCOztBQUUxQixJQUFJLElBQUksR0FBRyxFQUFFO0lBQ1QsSUFBSSxZQUFBO0lBQ0osSUFBSSxZQUFBO0lBQ0osT0FBTyxHQUFHLEtBQUs7SUFDZixRQUFRLEdBQUcsTUFBTSxDQUFD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UyxHQUFHLEVBQUUsQ0FBQztBQUN0QixpQkFBSyxDQUFDLEVBQUUsR0FBRyxZQUFZLENBQUM7QUFDeEIsa0JBQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUIsMEJBQWMsQ0FBQyxJQUFJLEdBQUcsRUFBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUMsQ0FBQyxDQUFDO1NBQ25HLEVBQ0QsS0FBSyxDQUNSLENBQUM7S0FDTDtDQUNKOzs7OztRQ3RCZSxjQUFjLEdBQWQsY0FBYzs7Ozs7SUFIdEIsT0FBTyxXQUFPLGNBQWMsRUFBNUIsT0FBTzs7SUFDUCxVQUFVLFdBQU8saUJBQWlCLEVBQWxDLFVBQVU7O0FBRVgsU0FBUyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQ25DLFFBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNO1FBQ3RCLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUTtRQUMxQixNQUFNLEdBQUcsQUFBQyxNQUFNLENBQUMsTUFBTSxHQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUztRQUNwRCxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTztRQUMzRCxJQUFJLFlBQUEsQ0FBQztBQUNULFdBQU8sQ0FBQyxJQUFJLEdBQUc7QUFDWCxnQkFBUSxFQUFSLFFBQVE7QUFDUixZQUFJLEVBQUosSUFBSTtBQUNKLGdCQUFRLEVBQUUsVUFBVTtBQUNwQixjQUFNLEVBQU4sTUFBTTtBQUNOLGNBQU0sRUFBTixNQUFNO0tBQ1QsQ0FBQyxDQUFDO0NBQ04iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtjb25maWd9ICAgICAgICAgICAgIGZyb20gJy4uL2RhdGEvY29uZmlnJztcbmltcG9ydCB7YnVpbGRXTFNzaWRlfSAgICAgICBmcm9tICcuL2pzL2J1aWxkV0xTc2lkZSc7XG5pbXBvcnQge3BhcnNlQ29tcG9uZW50fSAgICAgZnJvbSAnLi9qcy9wYXJzZUNvbXBvbmVudCc7XG5pbXBvcnQge2xpc3RlbkZvckNsaWNrc30gICAgZnJvbSAnLi9qcy9saXN0ZW5Gb3JDbGlja3MnO1xuaW1wb3J0IHtnZXRQYXJhbWV0ZXJCeU5hbWV9IGZyb20gJy4vanMvZ2V0UGFyYW1ldGVyQnlOYW1lJztcblxubGV0IGh0bWwgPSAnJyxcbiAgICBqc29uLFxuICAgIGFyZ3MsXG4gICAgaXNFcnJvciA9IGZhbHNlLFxuICAgIHdsc09yZGVyID0gY29uZmlnLndsc09yZGVyXG4gICAgO1xuXG5mdW5jdGlvbiBpbml0V0xTKCkge1xuICAgIC8vIGFkZCBiYXNlIGNvbXBvbmVudHMgYXMgZGV0ZXJtaW5lZCBieSBjb25maWcgb3JkZXJcbiAgICBPYmplY3Qua2V5cyh3bHNPcmRlcikuZm9yRWFjaChmdW5jdGlvbihrZXksIGluZGV4LCBhcnJheSkge1xuICAgICAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSxcbiAgICAgICAgICAgIGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKSxcbiAgICAgICAgICAgIHNpZGVEZWZhdWx0RmlsZU5hbWU7XG4gICAgICAgIGNoaWxkLmlkID0gd2xzT3JkZXJba2V5XTtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgaWYgKHdsc09yZGVyW2tleV0gPT09ICdzaWRlJykge1xuICAgICAgICAgICAgLy8gdG9kbyBtYWtlIHN1cmUgc2lkZSBkZWZhdWx0IGNvbXAgaXMgbm90IGluIGFycmF5IG9mIHJlZ3VsYXIgb3JkZXJcbiAgICAgICAgICAgIGxldCBwcmVsb2FkQ29tcG9uZW50ID0gZ2V0UGFyYW1ldGVyQnlOYW1lKHtrZXk6J2MnfSlcbiAgICAgICAgICAgIGlmIChwcmVsb2FkQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gQHRvZG86IHVzZSBbXS5maWx0ZXIgaGVyZSBmb3IgaW5wdXQgY2hlY2tpbmdcbiAgICAgICAgICAgICAgICBzaWRlRGVmYXVsdEZpbGVOYW1lID0gcHJlbG9hZENvbXBvbmVudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2lkZURlZmF1bHRGaWxlTmFtZSA9IGNvbmZpZy53bHNTaWRlLmRlZmF1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidWlsZFdMU3NpZGUoYXJncyA9IHtmaWxlTmFtZTogc2lkZURlZmF1bHRGaWxlTmFtZSwgY29uZmlnfSk7XG4gICAgICAgICAgICBwYXJzZUNvbXBvbmVudChhcmdzID0ge2ZpbGVOYW1lOiBzaWRlRGVmYXVsdEZpbGVOYW1lLCBwYXJlbnQ6ICd0aGVzaWRlJywgY29uZmlnfSk7XG4gICAgICAgICAgICBsaXN0ZW5Gb3JDbGlja3MoYXJncyA9IHtjbGFzc05hbWU6ICdzaWRlbGlua3MnLCBjb25maWd9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlQ29tcG9uZW50KGFyZ3MgPSB7ZmlsZU5hbWU6IHdsc09yZGVyW2tleV0sIGNvbmZpZ30pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmluaXRXTFMoKTtcblxuLyogdG9kb1xuc3RhcnQgbmV3IGNzcyBidWlsZFxuc2VydmljZSB3b3JrZXJcbi8vZ2V0IHJpZCBvZiAjIG9uY2xpY2tcbi8vb3BlbiBsaW5rcyBpbiBuZXcgdGFic1xuLy9zZXQgc2lkZSB0b2dnbGVcbmVuaGFuY2VtZW50czpcbmFkZCBtYXNvbnJ5IG9wdGlvbjogb25seSBsb2FkIGluIGRlc2t0b3AsIHR1cm4gb24vb2ZmLCBrZWVwIG9uIGZvciBhbGwgZGV2aWNlcywgY3NzIG1hc29ucnkgKGh0dHA6Ly93M2JpdHMuY29tL2Nzcy1tYXNvbnJ5LylcbmNvbm5lY3QgdG8gZ3NoZWV0IHRhYnNcbi8vbG9hZCBzaWRlIHZpYSB1cmwgcGFyYW1cbiovXG5cbi8vXG4vLyBmdW5jdGlvbiBzZXRNYXNvbnJ5KCkge1xuLy8gICAgIHZhciBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRlbnQnKTtcbi8vICAgICB2YXIgbXNucnkgPSBuZXcgTWFzb25yeSggZWxlbSwge1xuLy8gICAgICAgaXRlbVNlbGVjdG9yOiAndWwnXG4vLyAgICAgfSk7XG4vLyB9XG4iLCJleHBvcnQgbGV0IGNvbmZpZyA9IHtcbiAgICBodG1sOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgcHJlZml4OiAnPGxpPicsXG4gICAgICAgICAgICBzdWZmaXg6ICc8L2xpPidcbiAgICAgICAgfSxcbiAgICAgICAgaGVhZGVyOiB7XG4gICAgICAgICAgICBwcmVmaXg6ICc8aDI+JyxcbiAgICAgICAgICAgIHN1ZmZpeDogJzwvaDI+J1xuICAgICAgICB9LFxuICAgICAgICBzdWJoZWQ6IHtcbiAgICAgICAgICAgIHByZWZpeDogJzxoMz4nLFxuICAgICAgICAgICAgc3VmZml4OiAnPC9oMz4nXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHdsc09yZGVyOiBbXG4gICAgICAgICdob2NrZXknLFxuICAgICAgICAnYmFzZWJhbGwnLFxuICAgICAgICAnZm9vdGJhbGwnLFxuICAgICAgICAnZ29vZ2xlJyxcbiAgICAgICAgJ2RpZ2l0YWwnLFxuICAgICAgICAnc3RyZWFtJyxcbiAgICAgICAgJ290aGVyJyxcbiAgICAgICAgJ3NpZGUnXG4gICAgXSxcbiAgICB3bHNTaWRlOiB7XG4gICAgICAgIGZpbGVOYW1lOiAnc2lkZScsXG4gICAgICAgIGRlZmF1bHQ6ICdicCcsXG4gICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICAgICdicCcsXG4gICAgICAgICAgICAndG5yJyxcbiAgICAgICAgICAgICdkZXYyJyxcbiAgICAgICAgICAgICdqcycsXG4gICAgICAgICAgICAnd3AnLFxuICAgICAgICAgICAgJ21sYicsXG4gICAgICAgICAgICAndHJhdmVsJyxcbiAgICAgICAgICAgICdtb25leScsXG4gICAgICAgICAgICAnbWF0Y2h1cCBtbGInLFxuICAgICAgICAgICAgJ21hdGNodXAgY2ZiJ1xuICAgICAgICAgXVxuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgICBiYXNlRGlyOiAnLi9kYXRhLycsXG4gICAgICAgIGZpbGVFeHQ6ICcuanNvbidcbiAgICB9IFxufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBidWlsZEhUTUwocGFyYW1zKSB7XG5cbiAgICBsZXQgZGF0YSA9IHBhcmFtcy5qc29uLFxuICAgICAgICBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBmaWxlTmFtZSA9IHBhcmFtcy5maWxlTmFtZSxcbiAgICAgICAgYXJncyxcbiAgICAgICAgb3V0cHV0ID0gJyc7XG5cbiAgICBjb25zdCBoZHJQcmUgPSBjb25maWcuaHRtbC5oZWFkZXIucHJlZml4LFxuICAgICAgICAgIGhkclN1ZiA9IGNvbmZpZy5odG1sLmhlYWRlci5zdWZmaXgsXG4gICAgICAgICAgc3ViSGRyUHJlID0gY29uZmlnLmh0bWwuc3ViaGVkLnByZWZpeCxcbiAgICAgICAgICBzdWJIZHJTdWYgPSBjb25maWcuaHRtbC5zdWJoZWQuc3VmZml4LFxuICAgICAgICAgIHByZSA9IGNvbmZpZy5odG1sLm91dHB1dC5wcmVmaXgsXG4gICAgICAgICAgc3VmID0gY29uZmlnLmh0bWwub3V0cHV0LnN1ZmZpeDtcblxuICAgIC8vIGNvbXBvbmVudCBoZWFkZXJcbiAgICBvdXRwdXQgKz0gaGRyUHJlICsgZmlsZU5hbWUgKyBoZHJTdWY7XG5cbiAgICBpZiAoZGF0YS5vcHRpb25zKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGRhdGEub3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbihrZXksIGluZGV4KSB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gcHJlICsgJzxhIGNsYXNzPVwic2lkZWxpbmtzXCIgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIlwiPicgKyBkYXRhLm9wdGlvbnNba2V5XSArICc8L2E+JyArIHN1ZjtcbiAgICAgICAgICAgIG91dHB1dCArPSAnXFxuJztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEubGlua3MpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoZGF0YS5saW5rcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5saW5rc1trZXldID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLmxpbmtzW2tleV0gPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHN1YiBoZWFkZXJzXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSBzdWJIZHJQcmUgKyBrZXkgKyBzdWJIZHJTdWYgKyAnXFxuJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyByZWd1bGFyIGxpc3QgaXRlbVxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcHJlICsgJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgZGF0YS5saW5rc1trZXldICsgJ1wiPicgKyBrZXkgKyAnPC9hPicgKyBzdWY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dHB1dCArPSAnXFxuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5saW5rc1trZXldID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBwcmU7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZGF0YS5saW5rc1trZXldKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZGV4LCBhcnJheSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpcnN0IG9mIG1hbnkgaXRlbXMgb24gYSBzaW5nbGUgcm93XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgZGF0YS5saW5rc1trZXldW2l0ZW1dICsgJ1wiPicgKyBpdGVtICsgJzwvYT4nO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHJlc3Qgb2YgbWFueSBpdGVtcyBvbiBhIHNpbmdsZSByb3dcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSAnIC0gPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicgKyBkYXRhLmxpbmtzW2tleV1baXRlbV0gKyAnXCI+JyArIGl0ZW0uc3Vic3RyaW5nKDAsIDEpICsgJzwvYT4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICdcXG4nO1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBzdWY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHtpbnNlcnRIVE1MfSBmcm9tICcuL2luc2VydEhUTUwuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRXTFNzaWRlKHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBvcHRpb25zID0gY29uZmlnLndsc1NpZGUsXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIGZpbGVOYW1lLFxuICAgICAgICBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGhlc2lkZScpLFxuICAgICAgICBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgZmlsZU5hbWUgPSAocGFyYW1zLmZpbGVOYW1lKSA/IHBhcmFtcy5maWxlTmFtZSA6IGNvbmZpZy53bHNTaWRlLmRlZmF1bHQ7XG4gICAgY2hpbGQuaWQgPSBmaWxlTmFtZTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIGluc2VydEhUTUwoYXJncyA9IHtvcHRpb25zLCBjb25maWd9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRKU09OKHBhcmFtcykge1xuICAgIGxldCBjYWxsYmFjayA9IHBhcmFtcy5jYWxsYmFjayxcbiAgICAgICAgYXJncztcbiAgICBmZXRjaChwYXJhbXMuZmlsZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkgeyBcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgYXJncyA9IHBhcmFtcztcbiAgICAgICAgYXJncy5qc29uID0ganNvbjtcbiAgICAgICAgY2FsbGJhY2soYXJncyk7XG4gICAgfSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0UGFyYW1ldGVyQnlOYW1lKHBhcmFtcykge1xuICAgIGxldCBrZXksIFxuICAgICAgICB1cmw7XG4gICAga2V5ID0gcGFyYW1zLmtleTtcbiAgICB1cmwgPSAocGFyYW1zLnVybCkgPyBwYXJhbXMudXJsIDogd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAga2V5ID0ga2V5LnJlcGxhY2UoL1tcXFtcXF1dL2csIFwiXFxcXCQmXCIpO1xuICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoXCJbPyZdXCIgKyBrZXkgKyBcIig9KFteJiNdKil8JnwjfCQpXCIpLFxuICAgICAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xuICAgIGlmICghcmVzdWx0cykgcmV0dXJuIG51bGw7XG4gICAgaWYgKCFyZXN1bHRzWzJdKSByZXR1cm4gJyc7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xufVxuIiwiaW1wb3J0IHtidWlsZEhUTUx9IGZyb20gJy4vYnVpbGRIVE1MLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluc2VydEhUTUwocGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIGpzb24sXG4gICAgICAgIGZpbGVOYW1lLFxuICAgICAgICBlbGVtZW50LFxuICAgICAgICBodG1sLFxuICAgICAgICBhcmdzID0ge307XG4gICAgaWYgKHBhcmFtcy5qc29uKSB7XG4gICAgICAgIGpzb24gPSBwYXJhbXMuanNvbixcbiAgICAgICAgZmlsZU5hbWUgPSBwYXJhbXMuZmlsZU5hbWU7XG4gICAgfVxuICAgIGlmIChwYXJhbXMub3B0aW9ucykge1xuICAgICAgICBqc29uID0gcGFyYW1zLm9wdGlvbnMsXG4gICAgICAgIGZpbGVOYW1lID0gJ3NpZGUnO1xuICAgIH1cbiAgICBodG1sID0gYnVpbGRIVE1MKGFyZ3MgPSB7anNvbiwgY29uZmlnLCBmaWxlTmFtZX0pO1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmaWxlTmFtZSk7XG4vLyAgICBjb25zb2xlLmxvZyhmaWxlTmFtZSwgZWxlbWVudCk7XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xufVxuIiwiaW1wb3J0IHtnZXRKU09OfSBmcm9tICcuL2dldEpTT04uanMnO1xuaW1wb3J0IHtpbnNlcnRIVE1MfSBmcm9tICcuL2luc2VydEhUTUwuanMnO1xuaW1wb3J0IHtwYXJzZUNvbXBvbmVudH0gZnJvbSAnLi9wYXJzZUNvbXBvbmVudC5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5Gb3JDbGlja3MocGFyYW1zKSB7XG4gICAgbGV0IGNsYXNzTmFtZSA9IHBhcmFtcy5jbGFzc05hbWUsXG4gICAgICAgIGxpbmtzVG9DbGljayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKSxcbiAgICAgICAgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAgYXJncztcbiAgICBmb3IgKHZhciBpPTA7IGk8bGlua3NUb0NsaWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxpbmtzVG9DbGlja1tpXS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgJ2NsaWNrJywgXG4gICAgICAgICAgICBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGV0IHRoaXNGaWxlTmFtZSA9IHRoaXMudGV4dENvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aGVzaWRlJyksXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgY2hpbGQuaWQgPSB0aGlzRmlsZU5hbWU7XG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgICAgICAgICBwYXJzZUNvbXBvbmVudChhcmdzID0ge2ZpbGVOYW1lOiB0aGlzRmlsZU5hbWUsIHBhcmVudDogJ3RoZXNpZGUnLCBjb25maWcsIGdldEpTT04sIGluc2VydEhUTUx9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7Z2V0SlNPTn0gZnJvbSAnLi9nZXRKU09OLmpzJztcbmltcG9ydCB7aW5zZXJ0SFRNTH0gZnJvbSAnLi9pbnNlcnRIVE1MLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ29tcG9uZW50KHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBmaWxlTmFtZSA9IHBhcmFtcy5maWxlTmFtZSxcbiAgICAgICAgcGFyZW50ID0gKHBhcmFtcy5wYXJlbnQpID8gcGFyYW1zLnBhcmVudCA6ICdjb250ZW50JyxcbiAgICAgICAgZmlsZSA9IGNvbmZpZy5kYXRhLmJhc2VEaXIgKyBmaWxlTmFtZSArIGNvbmZpZy5kYXRhLmZpbGVFeHQsXG4gICAgICAgIGFyZ3M7XG4gICAgZ2V0SlNPTihhcmdzID0ge1xuICAgICAgICBmaWxlTmFtZSwgXG4gICAgICAgIGZpbGUsIFxuICAgICAgICBjYWxsYmFjazogaW5zZXJ0SFRNTCxcbiAgICAgICAgcGFyZW50LCBcbiAgICAgICAgY29uZmlnXG4gICAgfSk7XG59XG4iXX0=
