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
        var parent = document.getElementById("content"),
            child = document.createElement("ul");
        child.id = wlsOrder[key];
        parent.appendChild(child);
        if (wlsOrder[key] === "side") {
            // todo make sure side default comp is not in array of regular order
            buildWLSside(args = { config: config });
            parseComponent(args = { fileName: config.wlsSide["default"], parent: "theside", config: config });
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
        args = undefined,
        parent = document.getElementById("theside"),
        child = document.createElement("ul");
    child.id = config.wlsSide["default"];
    parent.appendChild(child);
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
        options: ["bp", "tnr", "dev2", "js", "wp", "mlb", "travel", "money", "matchup"]
    },
    data: {
        baseDir: "./data/",
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
        json = params.options, fileName = "side";
    }
    html = buildHTML(args = { json: json, config: config, fileName: fileName });
    element = document.getElementById(fileName);
    //    console.log(fileName, element);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvYXBwLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2J1aWxkSFRNTC5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9idWlsZFdMU3NpZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvY29uZmlnLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2dldEpTT04uanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvaW5zZXJ0SFRNTC5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9saXN0ZW5Gb3JDbGlja3MuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvcGFyc2VDb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztJQ0FRLE1BQU0sV0FBbUIsYUFBYSxFQUF0QyxNQUFNOztJQUNOLFlBQVksV0FBYSxtQkFBbUIsRUFBNUMsWUFBWTs7SUFDWixjQUFjLFdBQVcscUJBQXFCLEVBQTlDLGNBQWM7O0lBQ2QsZUFBZSxXQUFVLHNCQUFzQixFQUEvQyxlQUFlOztBQUV2QixJQUFJLElBQUksR0FBRyxFQUFFO0lBQ1QsSUFBSSxZQUFBO0lBQ0osSUFBSSxZQUFBO0lBQ0osT0FBTyxHQUFHLEtBQUs7SUFDZixRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FDekI7O0FBRUwsU0FBUyxPQUFPLEdBQUc7O0FBRWYsVUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxHQUFHLEVBQUUsS0FBSyxF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QyxRQUFRLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUMsQ0FBQyxDQUFDO1NBQ25HLEVBQ0QsS0FBSyxDQUNSLENBQUM7S0FDTDtDQUNKOzs7OztRQ3RCZSxjQUFjLEdBQWQsY0FBYzs7Ozs7SUFIdEIsT0FBTyxXQUFPLGNBQWMsRUFBNUIsT0FBTzs7SUFDUCxVQUFVLFdBQU8saUJBQWlCLEVBQWxDLFVBQVU7O0FBRVgsU0FBUyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQ25DLFFBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNO1FBQ3RCLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUTtRQUMxQixNQUFNLEdBQUcsQUFBQyxNQUFNLENBQUMsTUFBTSxHQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUztRQUNwRCxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTztRQUMzRCxJQUFJLFlBQUEsQ0FBQztBQUNULFdBQU8sQ0FBQyxJQUFJLEdBQUc7QUFDWCxnQkFBUSxFQUFSLFFBQVE7QUFDUixZQUFJLEVBQUosSUFBSTtBQUNKLGdCQUFRLEVBQUUsVUFBVTtBQUNwQixjQUFNLEVBQU4sTUFBTTtBQUNOLGNBQU0sRUFBTixNQUFNO0tBQ1QsQ0FBQyxDQUFDO0NBQ04iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtjb25maWd9ICAgICAgICAgICAgIGZyb20gJy4vanMvY29uZmlnJztcbmltcG9ydCB7YnVpbGRXTFNzaWRlfSAgICAgICBmcm9tICcuL2pzL2J1aWxkV0xTc2lkZSc7XG5pbXBvcnQge3BhcnNlQ29tcG9uZW50fSAgICAgZnJvbSAnLi9qcy9wYXJzZUNvbXBvbmVudCc7XG5pbXBvcnQge2xpc3RlbkZvckNsaWNrc30gICAgZnJvbSAnLi9qcy9saXN0ZW5Gb3JDbGlja3MnO1xuXG5sZXQgaHRtbCA9ICcnLFxuICAgIGpzb24sXG4gICAgYXJncyxcbiAgICBpc0Vycm9yID0gZmFsc2UsXG4gICAgd2xzT3JkZXIgPSBjb25maWcud2xzT3JkZXJcbiAgICA7XG5cbmZ1bmN0aW9uIGluaXRXTFMoKSB7XG4gICAgLy8gYWRkIGJhc2UgY29tcG9uZW50cyBhcyBkZXRlcm1pbmVkIGJ5IGNvbmZpZyBvcmRlclxuICAgIE9iamVjdC5rZXlzKHdsc09yZGVyKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpLFxuICAgICAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICBjaGlsZC5pZCA9IHdsc09yZGVyW2tleV07XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgIGlmICh3bHNPcmRlcltrZXldID09PSAnc2lkZScpIHtcbiAgICAgICAgICAgIC8vIHRvZG8gbWFrZSBzdXJlIHNpZGUgZGVmYXVsdCBjb21wIGlzIG5vdCBpbiBhcnJheSBvZiByZWd1bGFyIG9yZGVyXG4gICAgICAgICAgICBidWlsZFdMU3NpZGUoYXJncyA9IHtjb25maWd9KTtcbiAgICAgICAgICAgIHBhcnNlQ29tcG9uZW50KGFyZ3MgPSB7ZmlsZU5hbWU6IGNvbmZpZy53bHNTaWRlLmRlZmF1bHQsIHBhcmVudDogJ3RoZXNpZGUnLCBjb25maWd9KTtcbiAgICAgICAgICAgIGxpc3RlbkZvckNsaWNrcyhhcmdzID0ge2NsYXNzTmFtZTogJ3NpZGVsaW5rcycsIGNvbmZpZ30pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyc2VDb21wb25lbnQoYXJncyA9IHtmaWxlTmFtZTogd2xzT3JkZXJba2V5XSwgY29uZmlnfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuaW5pdFdMUygpO1xuXG4vKiB0b2RvXG5zdGFydCBuZXcgY3NzIGJ1aWxkXG5zZXJ2aWNlIHdvcmtlclxuLy9nZXQgcmlkIG9mICMgb25jbGlja1xuLy9vcGVuIGxpbmtzIGluIG5ldyB0YWJzXG4vL3NldCBzaWRlIHRvZ2dsZVxuZW5oYW5jZW1lbnRzOlxuYWRkIG1hc29ucnkgb3B0aW9uOiBvbmx5IGxvYWQgaW4gZGVza3RvcCwgdHVybiBvbi9vZmYsIGtlZXAgb24gZm9yIGFsbCBkZXZpY2VzLCBjc3MgbWFzb25yeSAoaHR0cDovL3czYml0cy5jb20vY3NzLW1hc29ucnkvKVxuY29ubmVjdCB0byBnc2hlZXQgdGFic1xubG9hZCBzaWRlIHZpYSB1cmwgcGFyYW1cbiovXG5cbi8vXG4vLyBmdW5jdGlvbiBzZXRNYXNvbnJ5KCkge1xuLy8gICAgIHZhciBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRlbnQnKTtcbi8vICAgICB2YXIgbXNucnkgPSBuZXcgTWFzb25yeSggZWxlbSwge1xuLy8gICAgICAgaXRlbVNlbGVjdG9yOiAndWwnXG4vLyAgICAgfSk7XG4vLyB9XG4iLCJleHBvcnQgZnVuY3Rpb24gYnVpbGRIVE1MKHBhcmFtcykge1xuXG4gICAgbGV0IGRhdGEgPSBwYXJhbXMuanNvbixcbiAgICAgICAgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAgZmlsZU5hbWUgPSBwYXJhbXMuZmlsZU5hbWUsXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIG91dHB1dCA9ICcnO1xuXG4gICAgY29uc3QgaGRyUHJlID0gY29uZmlnLmh0bWwuaGVhZGVyLnByZWZpeCxcbiAgICAgICAgICBoZHJTdWYgPSBjb25maWcuaHRtbC5oZWFkZXIuc3VmZml4LFxuICAgICAgICAgIHN1YkhkclByZSA9IGNvbmZpZy5odG1sLnN1YmhlZC5wcmVmaXgsXG4gICAgICAgICAgc3ViSGRyU3VmID0gY29uZmlnLmh0bWwuc3ViaGVkLnN1ZmZpeCxcbiAgICAgICAgICBwcmUgPSBjb25maWcuaHRtbC5vdXRwdXQucHJlZml4LFxuICAgICAgICAgIHN1ZiA9IGNvbmZpZy5odG1sLm91dHB1dC5zdWZmaXg7XG5cbiAgICAvLyBjb21wb25lbnQgaGVhZGVyXG4gICAgb3V0cHV0ICs9IGhkclByZSArIGZpbGVOYW1lICsgaGRyU3VmO1xuXG4gICAgaWYgKGRhdGEub3B0aW9ucykge1xuICAgICAgICBPYmplY3Qua2V5cyhkYXRhLm9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpbmRleCkge1xuICAgICAgICAgICAgb3V0cHV0ICs9IHByZSArICc8YSBjbGFzcz1cInNpZGVsaW5rc1wiIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJcIj4nICsgZGF0YS5vcHRpb25zW2tleV0gKyAnPC9hPicgKyBzdWY7XG4gICAgICAgICAgICBvdXRwdXQgKz0gJ1xcbic7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIGlmIChkYXRhLmxpbmtzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGRhdGEubGlua3MpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEubGlua3Nba2V5XSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5saW5rc1trZXldID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBzdWIgaGVhZGVyc1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gc3ViSGRyUHJlICsga2V5ICsgc3ViSGRyU3VmICsgJ1xcbic7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVndWxhciBsaXN0IGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHByZSArICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIGRhdGEubGlua3Nba2V5XSArICdcIj4nICsga2V5ICsgJzwvYT4nICsgc3VmO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ1xcbic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEubGlua3Nba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcHJlO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGRhdGEubGlua3Nba2V5XSkuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCwgYXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXJzdCBvZiBtYW55IGl0ZW1zIG9uIGEgc2luZ2xlIHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIGRhdGEubGlua3Nba2V5XVtpdGVtXSArICdcIj4nICsgaXRlbSArICc8L2E+JztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSByZXN0IG9mIG1hbnkgaXRlbXMgb24gYSBzaW5nbGUgcm93XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJyAtIDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgZGF0YS5saW5rc1trZXldW2l0ZW1dICsgJ1wiPicgKyBpdGVtLnN1YnN0cmluZygwLCAxKSArICc8L2E+JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSAnXFxuJztcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gc3VmO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7aW5zZXJ0SFRNTH0gZnJvbSAnLi9pbnNlcnRIVE1MLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkV0xTc2lkZShwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAgb3B0aW9ucyA9IGNvbmZpZy53bHNTaWRlLFxuICAgICAgICBhcmdzLFxuICAgICAgICBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGhlc2lkZScpLFxuICAgICAgICBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgIGNoaWxkLmlkID0gY29uZmlnLndsc1NpZGUuZGVmYXVsdDtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgIGluc2VydEhUTUwoYXJncyA9IHtvcHRpb25zLCBjb25maWd9KTtcbn1cbiIsImV4cG9ydCBsZXQgY29uZmlnID0ge1xuICAgIGh0bWw6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBwcmVmaXg6ICc8bGk+JyxcbiAgICAgICAgICAgIHN1ZmZpeDogJzwvbGk+J1xuICAgICAgICB9LFxuICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgIHByZWZpeDogJzxoMj4nLFxuICAgICAgICAgICAgc3VmZml4OiAnPC9oMj4nXG4gICAgICAgIH0sXG4gICAgICAgIHN1YmhlZDoge1xuICAgICAgICAgICAgcHJlZml4OiAnPGgzPicsXG4gICAgICAgICAgICBzdWZmaXg6ICc8L2gzPidcbiAgICAgICAgfVxuICAgIH0sXG4gICAgd2xzT3JkZXI6IFtcbiAgICAgICAgJ2hvY2tleScsXG4gICAgICAgICdiYXNlYmFsbCcsXG4gICAgICAgICdmb290YmFsbCcsXG4gICAgICAgICdnb29nbGUnLFxuICAgICAgICAnZGlnaXRhbCcsXG4gICAgICAgICdzdHJlYW0nLFxuICAgICAgICAnb3RoZXInLFxuICAgICAgICAnc2lkZSdcbiAgICBdLFxuICAgIHdsc1NpZGU6IHtcbiAgICAgICAgZmlsZU5hbWU6ICdzaWRlJyxcbiAgICAgICAgZGVmYXVsdDogJ2JwJyxcbiAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgICAgJ2JwJyxcbiAgICAgICAgICAgICd0bnInLFxuICAgICAgICAgICAgJ2RldjInLFxuICAgICAgICAgICAgJ2pzJyxcbiAgICAgICAgICAgICd3cCcsXG4gICAgICAgICAgICAnbWxiJyxcbiAgICAgICAgICAgICd0cmF2ZWwnLFxuICAgICAgICAgICAgJ21vbmV5JyxcbiAgICAgICAgICAgICdtYXRjaHVwJ1xuICAgICAgICAgXVxuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgICBiYXNlRGlyOiAnLi9kYXRhLycsXG4gICAgICAgIGZpbGVFeHQ6ICcuanNvbidcbiAgICB9IFxufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRKU09OKHBhcmFtcykge1xuICAgIGxldCBjYWxsYmFjayA9IHBhcmFtcy5jYWxsYmFjayxcbiAgICAgICAgYXJncztcbiAgICBmZXRjaChwYXJhbXMuZmlsZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkgeyBcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgYXJncyA9IHBhcmFtcztcbiAgICAgICAgYXJncy5qc29uID0ganNvbjtcbiAgICAgICAgY2FsbGJhY2soYXJncyk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQge2J1aWxkSFRNTH0gZnJvbSAnLi9idWlsZEhUTUwuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0SFRNTChwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAganNvbixcbiAgICAgICAgZmlsZU5hbWUsXG4gICAgICAgIGVsZW1lbnQsXG4gICAgICAgIGh0bWwsXG4gICAgICAgIGFyZ3MgPSB7fTtcbiAgICBpZiAocGFyYW1zLmpzb24pIHtcbiAgICAgICAganNvbiA9IHBhcmFtcy5qc29uLFxuICAgICAgICBmaWxlTmFtZSA9IHBhcmFtcy5maWxlTmFtZTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5vcHRpb25zKSB7XG4gICAgICAgIGpzb24gPSBwYXJhbXMub3B0aW9ucyxcbiAgICAgICAgZmlsZU5hbWUgPSAnc2lkZSc7XG4gICAgfVxuICAgIGh0bWwgPSBidWlsZEhUTUwoYXJncyA9IHtqc29uLCBjb25maWcsIGZpbGVOYW1lfSk7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZpbGVOYW1lKTtcbi8vICAgIGNvbnNvbGUubG9nKGZpbGVOYW1lLCBlbGVtZW50KTtcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IGh0bWw7XG59XG4iLCJpbXBvcnQge2dldEpTT059IGZyb20gJy4vZ2V0SlNPTi5qcyc7XG5pbXBvcnQge2luc2VydEhUTUx9IGZyb20gJy4vaW5zZXJ0SFRNTC5qcyc7XG5pbXBvcnQge3BhcnNlQ29tcG9uZW50fSBmcm9tICcuL3BhcnNlQ29tcG9uZW50LmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlbkZvckNsaWNrcyhwYXJhbXMpIHtcbiAgICBsZXQgY2xhc3NOYW1lID0gcGFyYW1zLmNsYXNzTmFtZSxcbiAgICAgICAgbGlua3NUb0NsaWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpLFxuICAgICAgICBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBhcmdzO1xuICAgIGZvciAodmFyIGk9MDsgaTxsaW5rc1RvQ2xpY2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGlua3NUb0NsaWNrW2ldLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAnY2xpY2snLCBcbiAgICAgICAgICAgIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZXQgdGhpc0ZpbGVOYW1lID0gdGhpcy50ZXh0Q29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RoZXNpZGUnKSxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgICAgIHBhcmVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICBjaGlsZC5pZCA9IHRoaXNGaWxlTmFtZTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgICAgIHBhcnNlQ29tcG9uZW50KGFyZ3MgPSB7ZmlsZU5hbWU6IHRoaXNGaWxlTmFtZSwgcGFyZW50OiAndGhlc2lkZScsIGNvbmZpZywgZ2V0SlNPTiwgaW5zZXJ0SFRNTH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtnZXRKU09OfSBmcm9tICcuL2dldEpTT04uanMnO1xuaW1wb3J0IHtpbnNlcnRIVE1MfSBmcm9tICcuL2luc2VydEhUTUwuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDb21wb25lbnQocGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIGZpbGVOYW1lID0gcGFyYW1zLmZpbGVOYW1lLFxuICAgICAgICBwYXJlbnQgPSAocGFyYW1zLnBhcmVudCkgPyBwYXJhbXMucGFyZW50IDogJ2NvbnRlbnQnLFxuICAgICAgICBmaWxlID0gY29uZmlnLmRhdGEuYmFzZURpciArIGZpbGVOYW1lICsgY29uZmlnLmRhdGEuZmlsZUV4dCxcbiAgICAgICAgYXJncztcbiAgICBnZXRKU09OKGFyZ3MgPSB7XG4gICAgICAgIGZpbGVOYW1lLCBcbiAgICAgICAgZmlsZSwgXG4gICAgICAgIGNhbGxiYWNrOiBpbnNlcnRIVE1MLFxuICAgICAgICBwYXJlbnQsIFxuICAgICAgICBjb25maWdcbiAgICB9KTtcbn1cbiJdfQ==
