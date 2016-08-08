(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var config = require("./js/config").config;

var getJSON = require("./js/getJSON").getJSON;

var insertHTML = require("./js/insertHTML").insertHTML;

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
        // order is important so we create our dom elements here to preserve order
        var parent = document.getElementById("content"),
            child = document.createElement("ul");
        child.id = wlsOrder[key];
        parent.appendChild(child);
        if (wlsOrder[key] !== "side") {
            parseComponent(args = { fileName: wlsOrder[key], config: config, getJSON: getJSON, insertHTML: insertHTML });
        } else {
            var _parent = document.getElementById("theside"),
                _child = document.createElement("ul");
            _child.id = config.wlsSide["default"];
            // todo if default is not in array of regular order
            _parent.appendChild(_child);
            buildWLSside(args = { config: config, insertHTML: insertHTML });
            parseComponent(args = { fileName: config.wlsSide["default"], parent: "theside", config: config, getJSON: getJSON, insertHTML: insertHTML });
            listenForClicks(args = { className: "sidelinks", parseComponent: parseComponent, config: config, getJSON: getJSON, insertHTML: insertHTML });
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

},{"./js/buildWLSside":3,"./js/config":4,"./js/getJSON":5,"./js/insertHTML":6,"./js/listenForClicks":7,"./js/parseComponent":8}],2:[function(require,module,exports){
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

function buildWLSside(params) {
    var config = params.config,
        insertHTML = params.insertHTML,
        options = config.wlsSide,
        args = undefined;
    insertHTML(args = { options: options, config: config });
}

},{}],4:[function(require,module,exports){
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
        json = params.options, fileName = "side";
    }
    html = buildHTML(args = { json: json, config: config, fileName: fileName });
    element = document.getElementById(fileName);
    element.innerHTML = html;
}

},{"./buildHTML.js":2}],7:[function(require,module,exports){
"use strict";

exports.listenForClicks = listenForClicks;
Object.defineProperty(exports, "__esModule", {
    value: true
});

function listenForClicks(params) {
    var className = params.className,
        parseComponent = params.parseComponent,
        linksToClick = document.getElementsByClassName(className),
        config = params.config,
        getJSON = params.getJSON,
        insertHTML = params.insertHTML,
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

},{}],8:[function(require,module,exports){
"use strict";

exports.parseComponent = parseComponent;
Object.defineProperty(exports, "__esModule", {
    value: true
});

function parseComponent(params) {
    var config = params.config,
        fileName = params.fileName,
        parent = params.parent ? params.parent : "content",
        file = config.data.baseDir + fileName + config.data.fileExt,
        getJSON = params.getJSON,
        insertHTML = params.insertHTML,
        args = undefined;
    getJSON(args = {
        fileName: fileName,
        file: file,
        callback: insertHTML,
        parent: parent,
        config: config
    });
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvYXBwLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2J1aWxkSFRNTC5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9idWlsZFdMU3NpZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvY29uZmlnLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2dldEpTT04uanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvaW5zZXJ0SFRNTC5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9saXN0ZW5Gb3JDbGlja3MuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvcGFyc2VDb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztJQ0FRLE1BQU0sV0FBbUIsYUFBYSxFQUF0QyxNQUFNOztJQUNOLE9BQU8sV0FBa0IsY0FBYyxFQUF2QyxPQUFPOztJQUNQLFVBQVUsV0FBZSxpQkFBaUIsRUFBMUMsVUFBVTs7SUFDVixZQUFZLFdBQWEsbUJBQW1CLEVBQTVDLFlBQVk7O0lBQ1osY0FBYyxXQUFXLHFCQUFxQixFQUE5QyxjQUFjOztJQUNkLGVBQWUsV0FBVSxzQkFBc0IsRUFBL0MsZUFBZTs7QUFFdkIsSUFBSSxJQUFJLEdBQUcsRUFBRTtJQUNULElBQUksWUFBQTtJQUNKLElBQUksWUFBQTtJQUNKLE9BQU8sR0FBRyxLQUFLO0lBQ2YsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQ3pCOztBQUVMLFNBQVMsT0FBTyxHQUFHOztBQUVm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KGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge2NvbmZpZ30gICAgICAgICAgICAgZnJvbSAnLi9qcy9jb25maWcnO1xuaW1wb3J0IHtnZXRKU09OfSAgICAgICAgICAgIGZyb20gJy4vanMvZ2V0SlNPTic7XG5pbXBvcnQge2luc2VydEhUTUx9ICAgICAgICAgZnJvbSAnLi9qcy9pbnNlcnRIVE1MJztcbmltcG9ydCB7YnVpbGRXTFNzaWRlfSAgICAgICBmcm9tICcuL2pzL2J1aWxkV0xTc2lkZSc7XG5pbXBvcnQge3BhcnNlQ29tcG9uZW50fSAgICAgZnJvbSAnLi9qcy9wYXJzZUNvbXBvbmVudCc7XG5pbXBvcnQge2xpc3RlbkZvckNsaWNrc30gICAgZnJvbSAnLi9qcy9saXN0ZW5Gb3JDbGlja3MnO1xuXG5sZXQgaHRtbCA9ICcnLFxuICAgIGpzb24sXG4gICAgYXJncyxcbiAgICBpc0Vycm9yID0gZmFsc2UsXG4gICAgd2xzT3JkZXIgPSBjb25maWcud2xzT3JkZXJcbiAgICA7XG5cbmZ1bmN0aW9uIGluaXRXTFMoKSB7XG4gICAgLy8gYWRkIGJhc2UgY29tcG9uZW50cyBhcyBkZXRlcm1pbmVkIGJ5IGNvbmZpZyBvcmRlclxuICAgIE9iamVjdC5rZXlzKHdsc09yZGVyKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgIC8vIG9yZGVyIGlzIGltcG9ydGFudCBzbyB3ZSBjcmVhdGUgb3VyIGRvbSBlbGVtZW50cyBoZXJlIHRvIHByZXNlcnZlIG9yZGVyXG4gICAgICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpLFxuICAgICAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICBjaGlsZC5pZCA9IHdsc09yZGVyW2tleV07XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgIGlmICh3bHNPcmRlcltrZXldICE9PSAnc2lkZScpIHtcbiAgICAgICAgICAgIHBhcnNlQ29tcG9uZW50KGFyZ3MgPSB7ZmlsZU5hbWU6IHdsc09yZGVyW2tleV0sIGNvbmZpZywgZ2V0SlNPTiwgaW5zZXJ0SFRNTH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aGVzaWRlJyksXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgY2hpbGQuaWQgPSBjb25maWcud2xzU2lkZS5kZWZhdWx0O1xuICAgICAgICAgICAgLy8gdG9kbyBpZiBkZWZhdWx0IGlzIG5vdCBpbiBhcnJheSBvZiByZWd1bGFyIG9yZGVyXG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgYnVpbGRXTFNzaWRlKGFyZ3MgPSB7Y29uZmlnLCBpbnNlcnRIVE1MfSk7XG4gICAgICAgICAgICBwYXJzZUNvbXBvbmVudChhcmdzID0ge2ZpbGVOYW1lOiBjb25maWcud2xzU2lkZS5kZWZhdWx0LCBwYXJlbnQ6ICd0aGVzaWRlJywgY29uZmlnLCBnZXRKU09OLCBpbnNlcnRIVE1MfSk7XG4gICAgICAgICAgICBsaXN0ZW5Gb3JDbGlja3MoYXJncyA9IHtjbGFzc05hbWU6ICdzaWRlbGlua3MnLCBwYXJzZUNvbXBvbmVudCwgY29uZmlnLCBnZXRKU09OLCBpbnNlcnRIVE1MfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuaW5pdFdMUygpO1xuXG4vKiB0b2RvXG5zdGFydCBuZXcgY3NzIGJ1aWxkXG5zZXJ2aWNlIHdvcmtlclxuLy9nZXQgcmlkIG9mICMgb25jbGlja1xuLy9vcGVuIGxpbmtzIGluIG5ldyB0YWJzXG4vL3NldCBzaWRlIHRvZ2dsZVxuZW5oYW5jZW1lbnRzOlxuYWRkIG1hc29ucnkgb3B0aW9uOiBvbmx5IGxvYWQgaW4gZGVza3RvcCwgdHVybiBvbi9vZmYsIGtlZXAgb24gZm9yIGFsbCBkZXZpY2VzLCBjc3MgbWFzb25yeSAoaHR0cDovL3czYml0cy5jb20vY3NzLW1hc29ucnkvKVxuY29ubmVjdCB0byBnc2hlZXQgdGFic1xubG9hZCBzaWRlIHZpYSB1cmwgcGFyYW1cbiovXG5cbi8vXG4vLyBmdW5jdGlvbiBzZXRNYXNvbnJ5KCkge1xuLy8gICAgIHZhciBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRlbnQnKTtcbi8vICAgICB2YXIgbXNucnkgPSBuZXcgTWFzb25yeSggZWxlbSwge1xuLy8gICAgICAgaXRlbVNlbGVjdG9yOiAndWwnXG4vLyAgICAgfSk7XG4vLyB9XG4iLCJleHBvcnQgZnVuY3Rpb24gYnVpbGRIVE1MKHBhcmFtcykge1xuXG4gICAgbGV0IGRhdGEgPSBwYXJhbXMuanNvbixcbiAgICAgICAgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAgZmlsZU5hbWUgPSBwYXJhbXMuZmlsZU5hbWUsXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIG91dHB1dCA9ICcnO1xuXG4gICAgY29uc3QgaGRyUHJlID0gY29uZmlnLmh0bWwuaGVhZGVyLnByZWZpeCxcbiAgICAgICAgICBoZHJTdWYgPSBjb25maWcuaHRtbC5oZWFkZXIuc3VmZml4LFxuICAgICAgICAgIHN1YkhkclByZSA9IGNvbmZpZy5odG1sLnN1YmhlZC5wcmVmaXgsXG4gICAgICAgICAgc3ViSGRyU3VmID0gY29uZmlnLmh0bWwuc3ViaGVkLnN1ZmZpeCxcbiAgICAgICAgICBwcmUgPSBjb25maWcuaHRtbC5vdXRwdXQucHJlZml4LFxuICAgICAgICAgIHN1ZiA9IGNvbmZpZy5odG1sLm91dHB1dC5zdWZmaXg7XG5cbiAgICAvLyBjb21wb25lbnQgaGVhZGVyXG4gICAgb3V0cHV0ICs9IGhkclByZSArIGZpbGVOYW1lICsgaGRyU3VmO1xuXG4gICAgaWYgKGRhdGEub3B0aW9ucykge1xuICAgICAgICBPYmplY3Qua2V5cyhkYXRhLm9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpbmRleCkge1xuICAgICAgICAgICAgb3V0cHV0ICs9IHByZSArICc8YSBjbGFzcz1cInNpZGVsaW5rc1wiIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJcIj4nICsgZGF0YS5vcHRpb25zW2tleV0gKyAnPC9hPicgKyBzdWY7XG4gICAgICAgICAgICBvdXRwdXQgKz0gJ1xcbic7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIGlmIChkYXRhLmxpbmtzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGRhdGEubGlua3MpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEubGlua3Nba2V5XSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5saW5rc1trZXldID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBzdWIgaGVhZGVyc1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gc3ViSGRyUHJlICsga2V5ICsgc3ViSGRyU3VmICsgJ1xcbic7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVndWxhciBsaXN0IGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHByZSArICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIGRhdGEubGlua3Nba2V5XSArICdcIj4nICsga2V5ICsgJzwvYT4nICsgc3VmO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ1xcbic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEubGlua3Nba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcHJlO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGRhdGEubGlua3Nba2V5XSkuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCwgYXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXJzdCBvZiBtYW55IGl0ZW1zIG9uIGEgc2luZ2xlIHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIGRhdGEubGlua3Nba2V5XVtpdGVtXSArICdcIj4nICsgaXRlbSArICc8L2E+JztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSByZXN0IG9mIG1hbnkgaXRlbXMgb24gYSBzaW5nbGUgcm93XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJyAtIDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgZGF0YS5saW5rc1trZXldW2l0ZW1dICsgJ1wiPicgKyBpdGVtLnN1YnN0cmluZygwLCAxKSArICc8L2E+JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSAnXFxuJztcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gc3VmO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBidWlsZFdMU3NpZGUocGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIGluc2VydEhUTUwgPSBwYXJhbXMuaW5zZXJ0SFRNTCxcbiAgICAgICAgb3B0aW9ucyA9IGNvbmZpZy53bHNTaWRlLFxuICAgICAgICBhcmdzO1xuICAgIGluc2VydEhUTUwoYXJncyA9IHtvcHRpb25zLCBjb25maWd9KTtcbn1cbiIsImV4cG9ydCBsZXQgY29uZmlnID0ge1xuICAgIGh0bWw6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBwcmVmaXg6ICc8bGk+JyxcbiAgICAgICAgICAgIHN1ZmZpeDogJzwvbGk+J1xuICAgICAgICB9LFxuICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgIHByZWZpeDogJzxoMj4nLFxuICAgICAgICAgICAgc3VmZml4OiAnPC9oMj4nXG4gICAgICAgIH0sXG4gICAgICAgIHN1YmhlZDoge1xuICAgICAgICAgICAgcHJlZml4OiAnPGgzPicsXG4gICAgICAgICAgICBzdWZmaXg6ICc8L2gzPidcbiAgICAgICAgfVxuICAgIH0sXG4gICAgd2xzT3JkZXI6IFtcbiAgICAgICAgJ2hvY2tleScsXG4gICAgICAgICdiYXNlYmFsbCcsXG4gICAgICAgICdmb290YmFsbCcsXG4gICAgICAgICdnb29nbGUnLFxuICAgICAgICAnZGlnaXRhbCcsXG4gICAgICAgICdzdHJlYW0nLFxuICAgICAgICAnb3RoZXInLFxuICAgICAgICAnc2lkZSdcbiAgICBdLFxuICAgIHdsc1NpZGU6IHtcbiAgICAgICAgZGVmYXVsdDogJ2JwJyxcbiAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgICAgJ2JwJyxcbiAgICAgICAgICAgICd0bnInLFxuICAgICAgICAgICAgJ2RldjInLFxuICAgICAgICAgICAgJ2pzJyxcbiAgICAgICAgICAgICd3cCcsXG4gICAgICAgICAgICAnbWxiJyxcbiAgICAgICAgICAgICdtYXRjaHVwJ1xuICAgICAgICAgXVxuICAgIH0sXG4gICAgZGF0YToge1xuICAgICAgICBiYXNlRGlyOiAnLi9zcmMvZGF0YS8nLFxuICAgICAgICBmaWxlRXh0OiAnLmpzb24nXG4gICAgfSBcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0SlNPTihwYXJhbXMpIHtcbiAgICBsZXQgY2FsbGJhY2sgPSBwYXJhbXMuY2FsbGJhY2ssXG4gICAgICAgIGFyZ3M7XG4gICAgZmV0Y2gocGFyYW1zLmZpbGUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHsgXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgfSkudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgICAgIGFyZ3MgPSBwYXJhbXM7XG4gICAgICAgIGFyZ3MuanNvbiA9IGpzb247XG4gICAgICAgIGNhbGxiYWNrKGFyZ3MpO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtidWlsZEhUTUx9IGZyb20gJy4vYnVpbGRIVE1MLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluc2VydEhUTUwocGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIGpzb24sXG4gICAgICAgIGZpbGVOYW1lLFxuICAgICAgICBlbGVtZW50LFxuICAgICAgICBodG1sLFxuICAgICAgICBhcmdzID0ge307XG4gICAgaWYgKHBhcmFtcy5qc29uKSB7XG4gICAgICAgIGpzb24gPSBwYXJhbXMuanNvbixcbiAgICAgICAgZmlsZU5hbWUgPSBwYXJhbXMuZmlsZU5hbWU7XG4gICAgfVxuICAgIGlmIChwYXJhbXMub3B0aW9ucykge1xuICAgICAgICBqc29uID0gcGFyYW1zLm9wdGlvbnMsXG4gICAgICAgIGZpbGVOYW1lID0gJ3NpZGUnO1xuICAgIH1cbiAgICBodG1sID0gYnVpbGRIVE1MKGFyZ3MgPSB7anNvbiwgY29uZmlnLCBmaWxlTmFtZX0pO1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmaWxlTmFtZSk7XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGxpc3RlbkZvckNsaWNrcyhwYXJhbXMpIHtcbiAgICBsZXQgY2xhc3NOYW1lID0gcGFyYW1zLmNsYXNzTmFtZSxcbiAgICAgICAgcGFyc2VDb21wb25lbnQgPSBwYXJhbXMucGFyc2VDb21wb25lbnQsXG4gICAgICAgIGxpbmtzVG9DbGljayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKSxcbiAgICAgICAgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAgZ2V0SlNPTiA9IHBhcmFtcy5nZXRKU09OLFxuICAgICAgICBpbnNlcnRIVE1MID0gcGFyYW1zLmluc2VydEhUTUwsXG4gICAgICAgIGFyZ3M7XG4gICAgZm9yICh2YXIgaT0wOyBpPGxpbmtzVG9DbGljay5sZW5ndGg7IGkrKykge1xuICAgICAgICBsaW5rc1RvQ2xpY2tbaV0uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICdjbGljaycsIFxuICAgICAgICAgICAgZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGxldCB0aGlzRmlsZU5hbWUgPSB0aGlzLnRleHRDb250ZW50LFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGhlc2lkZScpLFxuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgICAgICAgcGFyZW50LmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgIGNoaWxkLmlkID0gdGhpc0ZpbGVOYW1lO1xuICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICAgICAgcGFyc2VDb21wb25lbnQoYXJncyA9IHtmaWxlTmFtZTogdGhpc0ZpbGVOYW1lLCBwYXJlbnQ6ICd0aGVzaWRlJywgY29uZmlnLCBnZXRKU09OLCBpbnNlcnRIVE1MfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gcGFyc2VDb21wb25lbnQocGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIGZpbGVOYW1lID0gcGFyYW1zLmZpbGVOYW1lLFxuICAgICAgICBwYXJlbnQgPSAocGFyYW1zLnBhcmVudCkgPyBwYXJhbXMucGFyZW50IDogJ2NvbnRlbnQnLFxuICAgICAgICBmaWxlID0gY29uZmlnLmRhdGEuYmFzZURpciArIGZpbGVOYW1lICsgY29uZmlnLmRhdGEuZmlsZUV4dCxcbiAgICAgICAgZ2V0SlNPTiA9IHBhcmFtcy5nZXRKU09OLFxuICAgICAgICBpbnNlcnRIVE1MID0gcGFyYW1zLmluc2VydEhUTUwsXG4gICAgICAgIGFyZ3M7XG4gICAgZ2V0SlNPTihhcmdzID0ge1xuICAgICAgICBmaWxlTmFtZSwgXG4gICAgICAgIGZpbGUsIFxuICAgICAgICBjYWxsYmFjazogaW5zZXJ0SFRNTCxcbiAgICAgICAgcGFyZW50LCBcbiAgICAgICAgY29uZmlnXG4gICAgfSk7XG59XG4iXX0=
