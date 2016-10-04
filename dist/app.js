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
        options: ["bp", "tnr", "dev2", "js", "wp", "mlb", "travel", "money", "matchup-mlb", "matchup-nhl", "matchup-cfb", "matchup-all"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvYXBwLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvZGF0YS9jb25maWcuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvYnVpbGRIVE1MLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2J1aWxkV0xTc2lkZS5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9nZXRKU09OLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2dldFBhcmFtZXRlckJ5TmFtZS5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9pbnNlcnRIVE1MLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2xpc3RlbkZvckNsaWNrcy5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9wYXJzZUNvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0lDQVEsTUFBTSxXQUFtQixnQkFBZ0IsRUFBekMsTUFBTTs7SUFDTixZQUFZLFdBQWEsbUJBQW1CLEVBQTVDLFlBQVk7O0lBQ1osY0FBYyxXQUFXLHFCQUFxQixFQUE5QyxjQUFjOztJQUNkLGVBQWUsV0FBVSxzQkFBc0IsRUFBL0MsZUFBZTs7SUFDZixrQkFBa0IsV0FBTyx5QkFBeUIsRUFBbEQsa0JBQWtCOztBQUUxQixJQUFJLElBQUksR0FBRyxFQUFFO0lBQ1QsSUFBSSxZQUFBO0lBQ0osSUFBSSxZQUFBO0lBQ0osT0FBTyxHQUFHLEtBQUs7SUFDZixRQUFRLEdBQUcsTUFBTSxDQUFD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QUFDekMsa0JBQU0sQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLGlCQUFLLENBQUMsRUFBRSxHQUFHLFlBQVksQ0FBQztBQUN4QixrQkFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQiwwQkFBYyxDQUFDLElBQUksR0FBRyxFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBQyxDQUFDLENBQUM7U0FDbkcsRUFDRCxLQUFLLENBQ1IsQ0FBQztLQUNMO0NBQ0o7Ozs7O1FDdEJlLGNBQWMsR0FBZCxjQUFjOzs7OztJQUh0QixPQUFPLFdBQU8sY0FBYyxFQUE1QixPQUFPOztJQUNQLFVBQVUsV0FBTyxpQkFBaUIsRUFBbEMsVUFBVTs7QUFFWCxTQUFTLGNBQWMsQ0FBQyxNQUFNLEVBQUU7QUFDbkMsUUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU07UUFDdEIsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRO1FBQzFCLE1BQU0sR0FBRyxBQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxTQUFTO1FBQ3BELElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPO1FBQzNELElBQUksWUFBQSxDQUFDO0FBQ1QsV0FBTyxDQUFDLElBQUksR0FBRztBQUNYLGdCQUFRLEVBQVIsUUFBUTtBQUNSLFlBQUksRUFBSixJQUFJO0FBQ0osZ0JBQVEsRUFBRSxVQUFVO0FBQ3BCLGNBQU0sRUFBTixNQUFNO0FBQ04sY0FBTSxFQUFOLE1BQU07S0FDVCxDQUFDLENBQUM7Q0FDTiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge2NvbmZpZ30gICAgICAgICAgICAgZnJvbSAnLi4vZGF0YS9jb25maWcnO1xuaW1wb3J0IHtidWlsZFdMU3NpZGV9ICAgICAgIGZyb20gJy4vanMvYnVpbGRXTFNzaWRlJztcbmltcG9ydCB7cGFyc2VDb21wb25lbnR9ICAgICBmcm9tICcuL2pzL3BhcnNlQ29tcG9uZW50JztcbmltcG9ydCB7bGlzdGVuRm9yQ2xpY2tzfSAgICBmcm9tICcuL2pzL2xpc3RlbkZvckNsaWNrcyc7XG5pbXBvcnQge2dldFBhcmFtZXRlckJ5TmFtZX0gZnJvbSAnLi9qcy9nZXRQYXJhbWV0ZXJCeU5hbWUnO1xuXG5sZXQgaHRtbCA9ICcnLFxuICAgIGpzb24sXG4gICAgYXJncyxcbiAgICBpc0Vycm9yID0gZmFsc2UsXG4gICAgd2xzT3JkZXIgPSBjb25maWcud2xzT3JkZXJcbiAgICA7XG5cbmZ1bmN0aW9uIGluaXRXTFMoKSB7XG4gICAgLy8gYWRkIGJhc2UgY29tcG9uZW50cyBhcyBkZXRlcm1pbmVkIGJ5IGNvbmZpZyBvcmRlclxuICAgIE9iamVjdC5rZXlzKHdsc09yZGVyKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpLFxuICAgICAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpLFxuICAgICAgICAgICAgc2lkZURlZmF1bHRGaWxlTmFtZTtcbiAgICAgICAgY2hpbGQuaWQgPSB3bHNPcmRlcltrZXldO1xuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICBpZiAod2xzT3JkZXJba2V5XSA9PT0gJ3NpZGUnKSB7XG4gICAgICAgICAgICAvLyB0b2RvIG1ha2Ugc3VyZSBzaWRlIGRlZmF1bHQgY29tcCBpcyBub3QgaW4gYXJyYXkgb2YgcmVndWxhciBvcmRlclxuICAgICAgICAgICAgbGV0IHByZWxvYWRDb21wb25lbnQgPSBnZXRQYXJhbWV0ZXJCeU5hbWUoe2tleTonYyd9KVxuICAgICAgICAgICAgaWYgKHByZWxvYWRDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBAdG9kbzogdXNlIFtdLmZpbHRlciBoZXJlIGZvciBpbnB1dCBjaGVja2luZ1xuICAgICAgICAgICAgICAgIHNpZGVEZWZhdWx0RmlsZU5hbWUgPSBwcmVsb2FkQ29tcG9uZW50O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzaWRlRGVmYXVsdEZpbGVOYW1lID0gY29uZmlnLndsc1NpZGUuZGVmYXVsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1aWxkV0xTc2lkZShhcmdzID0ge2ZpbGVOYW1lOiBzaWRlRGVmYXVsdEZpbGVOYW1lLCBjb25maWd9KTtcbiAgICAgICAgICAgIHBhcnNlQ29tcG9uZW50KGFyZ3MgPSB7ZmlsZU5hbWU6IHNpZGVEZWZhdWx0RmlsZU5hbWUsIHBhcmVudDogJ3RoZXNpZGUnLCBjb25maWd9KTtcbiAgICAgICAgICAgIGxpc3RlbkZvckNsaWNrcyhhcmdzID0ge2NsYXNzTmFtZTogJ3NpZGVsaW5rcycsIGNvbmZpZ30pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyc2VDb21wb25lbnQoYXJncyA9IHtmaWxlTmFtZTogd2xzT3JkZXJba2V5XSwgY29uZmlnfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuaW5pdFdMUygpO1xuXG4vKiB0b2RvXG5zdGFydCBuZXcgY3NzIGJ1aWxkXG5zZXJ2aWNlIHdvcmtlclxuLy9nZXQgcmlkIG9mICMgb25jbGlja1xuLy9vcGVuIGxpbmtzIGluIG5ldyB0YWJzXG4vL3NldCBzaWRlIHRvZ2dsZVxuZW5oYW5jZW1lbnRzOlxuYWRkIG1hc29ucnkgb3B0aW9uOiBvbmx5IGxvYWQgaW4gZGVza3RvcCwgdHVybiBvbi9vZmYsIGtlZXAgb24gZm9yIGFsbCBkZXZpY2VzLCBjc3MgbWFzb25yeSAoaHR0cDovL3czYml0cy5jb20vY3NzLW1hc29ucnkvKVxuY29ubmVjdCB0byBnc2hlZXQgdGFic1xuLy9sb2FkIHNpZGUgdmlhIHVybCBwYXJhbVxuKi9cblxuLy9cbi8vIGZ1bmN0aW9uIHNldE1hc29ucnkoKSB7XG4vLyAgICAgdmFyIGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpO1xuLy8gICAgIHZhciBtc25yeSA9IG5ldyBNYXNvbnJ5KCBlbGVtLCB7XG4vLyAgICAgICBpdGVtU2VsZWN0b3I6ICd1bCdcbi8vICAgICB9KTtcbi8vIH1cbiIsImV4cG9ydCBsZXQgY29uZmlnID0ge1xuICAgIGh0bWw6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICBwcmVmaXg6ICc8bGk+JyxcbiAgICAgICAgICAgIHN1ZmZpeDogJzwvbGk+J1xuICAgICAgICB9LFxuICAgICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgIHByZWZpeDogJzxoMj4nLFxuICAgICAgICAgICAgc3VmZml4OiAnPC9oMj4nXG4gICAgICAgIH0sXG4gICAgICAgIHN1YmhlZDoge1xuICAgICAgICAgICAgcHJlZml4OiAnPGgzPicsXG4gICAgICAgICAgICBzdWZmaXg6ICc8L2gzPidcbiAgICAgICAgfVxuICAgIH0sXG4gICAgd2xzT3JkZXI6IFtcbiAgICAgICAgJ2hvY2tleScsXG4gICAgICAgICdiYXNlYmFsbCcsXG4gICAgICAgICdmb290YmFsbCcsXG4gICAgICAgICdnb29nbGUnLFxuICAgICAgICAnZGlnaXRhbCcsXG4gICAgICAgICdzdHJlYW0nLFxuICAgICAgICAnb3RoZXInLFxuICAgICAgICAnc2lkZSdcbiAgICBdLFxuICAgIHdsc1NpZGU6IHtcbiAgICAgICAgZmlsZU5hbWU6ICdzaWRlJyxcbiAgICAgICAgZGVmYXVsdDogJ2JwJyxcbiAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgICAgJ2JwJyxcbiAgICAgICAgICAgICd0bnInLFxuICAgICAgICAgICAgJ2RldjInLFxuICAgICAgICAgICAgJ2pzJyxcbiAgICAgICAgICAgICd3cCcsXG4gICAgICAgICAgICAnbWxiJyxcbiAgICAgICAgICAgICd0cmF2ZWwnLFxuICAgICAgICAgICAgJ21vbmV5JyxcbiAgICAgICAgICAgICdtYXRjaHVwLW1sYicsXG4gICAgICAgICAgICAnbWF0Y2h1cC1uaGwnLFxuICAgICAgICAgICAgJ21hdGNodXAtY2ZiJyxcbiAgICAgICAgICAgICdtYXRjaHVwLWFsbCdcbiAgICAgICAgIF1cbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgICAgYmFzZURpcjogJy4vZGF0YS8nLFxuICAgICAgICBmaWxlRXh0OiAnLmpzb24nXG4gICAgfSBcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gYnVpbGRIVE1MKHBhcmFtcykge1xuXG4gICAgbGV0IGRhdGEgPSBwYXJhbXMuanNvbixcbiAgICAgICAgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAgZmlsZU5hbWUgPSBwYXJhbXMuZmlsZU5hbWUsXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIG91dHB1dCA9ICcnO1xuXG4gICAgY29uc3QgaGRyUHJlID0gY29uZmlnLmh0bWwuaGVhZGVyLnByZWZpeCxcbiAgICAgICAgICBoZHJTdWYgPSBjb25maWcuaHRtbC5oZWFkZXIuc3VmZml4LFxuICAgICAgICAgIHN1YkhkclByZSA9IGNvbmZpZy5odG1sLnN1YmhlZC5wcmVmaXgsXG4gICAgICAgICAgc3ViSGRyU3VmID0gY29uZmlnLmh0bWwuc3ViaGVkLnN1ZmZpeCxcbiAgICAgICAgICBwcmUgPSBjb25maWcuaHRtbC5vdXRwdXQucHJlZml4LFxuICAgICAgICAgIHN1ZiA9IGNvbmZpZy5odG1sLm91dHB1dC5zdWZmaXg7XG5cbiAgICAvLyBjb21wb25lbnQgaGVhZGVyXG4gICAgb3V0cHV0ICs9IGhkclByZSArIGZpbGVOYW1lICsgaGRyU3VmO1xuXG4gICAgaWYgKGRhdGEub3B0aW9ucykge1xuICAgICAgICBPYmplY3Qua2V5cyhkYXRhLm9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpbmRleCkge1xuICAgICAgICAgICAgb3V0cHV0ICs9IHByZSArICc8YSBjbGFzcz1cInNpZGVsaW5rc1wiIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJcIj4nICsgZGF0YS5vcHRpb25zW2tleV0gKyAnPC9hPicgKyBzdWY7XG4gICAgICAgICAgICBvdXRwdXQgKz0gJ1xcbic7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxuICAgIGlmIChkYXRhLmxpbmtzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGRhdGEubGlua3MpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEubGlua3Nba2V5XSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5saW5rc1trZXldID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBzdWIgaGVhZGVyc1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gc3ViSGRyUHJlICsga2V5ICsgc3ViSGRyU3VmICsgJ1xcbic7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVndWxhciBsaXN0IGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHByZSArICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIGRhdGEubGlua3Nba2V5XSArICdcIj4nICsga2V5ICsgJzwvYT4nICsgc3VmO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ1xcbic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEubGlua3Nba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcHJlO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGRhdGEubGlua3Nba2V5XSkuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCwgYXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXJzdCBvZiBtYW55IGl0ZW1zIG9uIGEgc2luZ2xlIHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9ICc8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIGRhdGEubGlua3Nba2V5XVtpdGVtXSArICdcIj4nICsgaXRlbSArICc8L2E+JztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSByZXN0IG9mIG1hbnkgaXRlbXMgb24gYSBzaW5nbGUgcm93XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJyAtIDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgZGF0YS5saW5rc1trZXldW2l0ZW1dICsgJ1wiPicgKyBpdGVtLnN1YnN0cmluZygwLCAxKSArICc8L2E+JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSAnXFxuJztcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gc3VmO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7aW5zZXJ0SFRNTH0gZnJvbSAnLi9pbnNlcnRIVE1MLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkV0xTc2lkZShwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAgb3B0aW9ucyA9IGNvbmZpZy53bHNTaWRlLFxuICAgICAgICBhcmdzLFxuICAgICAgICBmaWxlTmFtZSxcbiAgICAgICAgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RoZXNpZGUnKSxcbiAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIGZpbGVOYW1lID0gKHBhcmFtcy5maWxlTmFtZSkgPyBwYXJhbXMuZmlsZU5hbWUgOiBjb25maWcud2xzU2lkZS5kZWZhdWx0O1xuICAgIGNoaWxkLmlkID0gZmlsZU5hbWU7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICBpbnNlcnRIVE1MKGFyZ3MgPSB7b3B0aW9ucywgY29uZmlnfSk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0SlNPTihwYXJhbXMpIHtcbiAgICBsZXQgY2FsbGJhY2sgPSBwYXJhbXMuY2FsbGJhY2ssXG4gICAgICAgIGFyZ3M7XG4gICAgZmV0Y2gocGFyYW1zLmZpbGUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHsgXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgfSkudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgICAgIGFyZ3MgPSBwYXJhbXM7XG4gICAgICAgIGFyZ3MuanNvbiA9IGpzb247XG4gICAgICAgIGNhbGxiYWNrKGFyZ3MpO1xuICAgIH0pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldFBhcmFtZXRlckJ5TmFtZShwYXJhbXMpIHtcbiAgICBsZXQga2V5LCBcbiAgICAgICAgdXJsO1xuICAgIGtleSA9IHBhcmFtcy5rZXk7XG4gICAgdXJsID0gKHBhcmFtcy51cmwpID8gcGFyYW1zLnVybCA6IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIGtleSA9IGtleS5yZXBsYWNlKC9bXFxbXFxdXS9nLCBcIlxcXFwkJlwiKTtcbiAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKFwiWz8mXVwiICsga2V5ICsgXCIoPShbXiYjXSopfCZ8I3wkKVwiKSxcbiAgICAgICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcbiAgICBpZiAoIXJlc3VsdHMpIHJldHVybiBudWxsO1xuICAgIGlmICghcmVzdWx0c1syXSkgcmV0dXJuICcnO1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1syXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpKTtcbn1cbiIsImltcG9ydCB7YnVpbGRIVE1MfSBmcm9tICcuL2J1aWxkSFRNTC5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRIVE1MKHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBqc29uLFxuICAgICAgICBmaWxlTmFtZSxcbiAgICAgICAgZWxlbWVudCxcbiAgICAgICAgaHRtbCxcbiAgICAgICAgYXJncyA9IHt9O1xuICAgIGlmIChwYXJhbXMuanNvbikge1xuICAgICAgICBqc29uID0gcGFyYW1zLmpzb24sXG4gICAgICAgIGZpbGVOYW1lID0gcGFyYW1zLmZpbGVOYW1lO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLm9wdGlvbnMpIHtcbiAgICAgICAganNvbiA9IHBhcmFtcy5vcHRpb25zLFxuICAgICAgICBmaWxlTmFtZSA9ICdzaWRlJztcbiAgICB9XG4gICAgaHRtbCA9IGJ1aWxkSFRNTChhcmdzID0ge2pzb24sIGNvbmZpZywgZmlsZU5hbWV9KTtcbiAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZmlsZU5hbWUpO1xuLy8gICAgY29uc29sZS5sb2coZmlsZU5hbWUsIGVsZW1lbnQpO1xuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gaHRtbDtcbn1cbiIsImltcG9ydCB7Z2V0SlNPTn0gZnJvbSAnLi9nZXRKU09OLmpzJztcbmltcG9ydCB7aW5zZXJ0SFRNTH0gZnJvbSAnLi9pbnNlcnRIVE1MLmpzJztcbmltcG9ydCB7cGFyc2VDb21wb25lbnR9IGZyb20gJy4vcGFyc2VDb21wb25lbnQuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gbGlzdGVuRm9yQ2xpY2tzKHBhcmFtcykge1xuICAgIGxldCBjbGFzc05hbWUgPSBwYXJhbXMuY2xhc3NOYW1lLFxuICAgICAgICBsaW5rc1RvQ2xpY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZSksXG4gICAgICAgIGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIGFyZ3M7XG4gICAgZm9yICh2YXIgaT0wOyBpPGxpbmtzVG9DbGljay5sZW5ndGg7IGkrKykge1xuICAgICAgICBsaW5rc1RvQ2xpY2tbaV0uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICdjbGljaycsIFxuICAgICAgICAgICAgZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGxldCB0aGlzRmlsZU5hbWUgPSB0aGlzLnRleHRDb250ZW50LFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGhlc2lkZScpLFxuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgICAgICAgcGFyZW50LmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgIGNoaWxkLmlkID0gdGhpc0ZpbGVOYW1lO1xuICAgICAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICAgICAgcGFyc2VDb21wb25lbnQoYXJncyA9IHtmaWxlTmFtZTogdGhpc0ZpbGVOYW1lLCBwYXJlbnQ6ICd0aGVzaWRlJywgY29uZmlnLCBnZXRKU09OLCBpbnNlcnRIVE1MfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge2dldEpTT059IGZyb20gJy4vZ2V0SlNPTi5qcyc7XG5pbXBvcnQge2luc2VydEhUTUx9IGZyb20gJy4vaW5zZXJ0SFRNTC5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUNvbXBvbmVudChwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAgZmlsZU5hbWUgPSBwYXJhbXMuZmlsZU5hbWUsXG4gICAgICAgIHBhcmVudCA9IChwYXJhbXMucGFyZW50KSA/IHBhcmFtcy5wYXJlbnQgOiAnY29udGVudCcsXG4gICAgICAgIGZpbGUgPSBjb25maWcuZGF0YS5iYXNlRGlyICsgZmlsZU5hbWUgKyBjb25maWcuZGF0YS5maWxlRXh0LFxuICAgICAgICBhcmdzO1xuICAgIGdldEpTT04oYXJncyA9IHtcbiAgICAgICAgZmlsZU5hbWUsIFxuICAgICAgICBmaWxlLCBcbiAgICAgICAgY2FsbGJhY2s6IGluc2VydEhUTUwsXG4gICAgICAgIHBhcmVudCwgXG4gICAgICAgIGNvbmZpZ1xuICAgIH0pO1xufVxuIl19
