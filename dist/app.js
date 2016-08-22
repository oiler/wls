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
        json = params.options, fileName = config.wlsSide["default"];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvYXBwLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2J1aWxkSFRNTC5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9idWlsZFdMU3NpZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvY29uZmlnLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2dldEpTT04uanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvaW5zZXJ0SFRNTC5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9saXN0ZW5Gb3JDbGlja3MuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvcGFyc2VDb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztJQ0FRLE1BQU0sV0FBbUIsYUFBYSxFQUF0QyxNQUFNOztJQUNOLFlBQVksV0FBYSxtQkFBbUIsRUFBNUMsWUFBWTs7SUFDWixjQUFjLFdBQVcscUJBQXFCLEVBQTlDLGNBQWM7O0lBQ2QsZUFBZSxXQUFVLHNCQUFzQixFQUEvQyxlQUFlOztBQUV2QixJQUFJLElBQUksR0FBRyxFQUFFO0lBQ1QsSUFBSSxZQUFBO0lBQ0osSUFBSSxZQUFBO0lBQ0osT0FBTyxHQUFHLEtBQUs7SUFDZixRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FDekI7O0FBRUwsU0FBUyxPQUFPLEdBQUc7O0FBRWYsVUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxHQUFHLEVBQUUsS0FBSyxF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LElBQUksR0FBRyxFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBQyxDQUFDLENBQUM7U0FDbkcsRUFDRCxLQUFLLENBQ1IsQ0FBQztLQUNMO0NBQ0o7Ozs7O1FDdEJlLGNBQWMsR0FBZCxjQUFjOzs7OztJQUh0QixPQUFPLFdBQU8sY0FBYyxFQUE1QixPQUFPOztJQUNQLFVBQVUsV0FBTyxpQkFBaUIsRUFBbEMsVUFBVTs7QUFFWCxTQUFTLGNBQWMsQ0FBQyxNQUFNLEVBQUU7QUFDbkMsUUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU07UUFDdEIsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRO1FBQzFCLE1BQU0sR0FBRyxBQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxTQUFTO1FBQ3BELElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPO1FBQzNELElBQUksWUFBQSxDQUFDO0FBQ1QsV0FBTyxDQUFDLElBQUksR0FBRztBQUNYLGdCQUFRLEVBQVIsUUFBUTtBQUNSLFlBQUksRUFBSixJQUFJO0FBQ0osZ0JBQVEsRUFBRSxVQUFVO0FBQ3BCLGNBQU0sRUFBTixNQUFNO0FBQ04sY0FBTSxFQUFOLE1BQU07S0FDVCxDQUFDLENBQUM7Q0FDTiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge2NvbmZpZ30gICAgICAgICAgICAgZnJvbSAnLi9qcy9jb25maWcnO1xuaW1wb3J0IHtidWlsZFdMU3NpZGV9ICAgICAgIGZyb20gJy4vanMvYnVpbGRXTFNzaWRlJztcbmltcG9ydCB7cGFyc2VDb21wb25lbnR9ICAgICBmcm9tICcuL2pzL3BhcnNlQ29tcG9uZW50JztcbmltcG9ydCB7bGlzdGVuRm9yQ2xpY2tzfSAgICBmcm9tICcuL2pzL2xpc3RlbkZvckNsaWNrcyc7XG5cbmxldCBodG1sID0gJycsXG4gICAganNvbixcbiAgICBhcmdzLFxuICAgIGlzRXJyb3IgPSBmYWxzZSxcbiAgICB3bHNPcmRlciA9IGNvbmZpZy53bHNPcmRlclxuICAgIDtcblxuZnVuY3Rpb24gaW5pdFdMUygpIHtcbiAgICAvLyBhZGQgYmFzZSBjb21wb25lbnRzIGFzIGRldGVybWluZWQgYnkgY29uZmlnIG9yZGVyXG4gICAgT2JqZWN0LmtleXMod2xzT3JkZXIpLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpbmRleCwgYXJyYXkpIHtcbiAgICAgICAgaWYgKHdsc09yZGVyW2tleV0gPT09ICdzaWRlJykge1xuICAgICAgICAgICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aGVzaWRlJyksXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgY2hpbGQuaWQgPSBjb25maWcud2xzU2lkZS5kZWZhdWx0O1xuICAgICAgICAgICAgLy8gdG9kbyBtYWtlIHN1cmUgc2lkZSBkZWZhdWx0IGNvbXAgaXMgbm90IGluIGFycmF5IG9mIHJlZ3VsYXIgb3JkZXJcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICBidWlsZFdMU3NpZGUoYXJncyA9IHtjb25maWd9KTtcbiAgICAgICAgICAgIHBhcnNlQ29tcG9uZW50KGFyZ3MgPSB7ZmlsZU5hbWU6IGNvbmZpZy53bHNTaWRlLmRlZmF1bHQsIHBhcmVudDogJ3RoZXNpZGUnLCBjb25maWd9KTtcbiAgICAgICAgICAgIGxpc3RlbkZvckNsaWNrcyhhcmdzID0ge2NsYXNzTmFtZTogJ3NpZGVsaW5rcycsIGNvbmZpZ30pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gb3JkZXIgaXMgaW1wb3J0YW50IHNvIHdlIGNyZWF0ZSBvdXIgZG9tIGVsZW1lbnRzIGhlcmUgdG8gcHJlc2VydmUgb3JkZXJcbiAgICAgICAgICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpLFxuICAgICAgICAgICAgICAgIGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgIGNoaWxkLmlkID0gd2xzT3JkZXJba2V5XTtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICBwYXJzZUNvbXBvbmVudChhcmdzID0ge2ZpbGVOYW1lOiB3bHNPcmRlcltrZXldLCBjb25maWd9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5pbml0V0xTKCk7XG5cbi8qIHRvZG9cbnN0YXJ0IG5ldyBjc3MgYnVpbGRcbnNlcnZpY2Ugd29ya2VyXG4vL2dldCByaWQgb2YgIyBvbmNsaWNrXG4vL29wZW4gbGlua3MgaW4gbmV3IHRhYnNcbi8vc2V0IHNpZGUgdG9nZ2xlXG5lbmhhbmNlbWVudHM6XG5hZGQgbWFzb25yeSBvcHRpb246IG9ubHkgbG9hZCBpbiBkZXNrdG9wLCB0dXJuIG9uL29mZiwga2VlcCBvbiBmb3IgYWxsIGRldmljZXMsIGNzcyBtYXNvbnJ5IChodHRwOi8vdzNiaXRzLmNvbS9jc3MtbWFzb25yeS8pXG5jb25uZWN0IHRvIGdzaGVldCB0YWJzXG5sb2FkIHNpZGUgdmlhIHVybCBwYXJhbVxuKi9cblxuLy9cbi8vIGZ1bmN0aW9uIHNldE1hc29ucnkoKSB7XG4vLyAgICAgdmFyIGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpO1xuLy8gICAgIHZhciBtc25yeSA9IG5ldyBNYXNvbnJ5KCBlbGVtLCB7XG4vLyAgICAgICBpdGVtU2VsZWN0b3I6ICd1bCdcbi8vICAgICB9KTtcbi8vIH1cbiIsImV4cG9ydCBmdW5jdGlvbiBidWlsZEhUTUwocGFyYW1zKSB7XG5cbiAgICBsZXQgZGF0YSA9IHBhcmFtcy5qc29uLFxuICAgICAgICBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBmaWxlTmFtZSA9IHBhcmFtcy5maWxlTmFtZSxcbiAgICAgICAgYXJncyxcbiAgICAgICAgb3V0cHV0ID0gJyc7XG5cbiAgICBjb25zdCBoZHJQcmUgPSBjb25maWcuaHRtbC5oZWFkZXIucHJlZml4LFxuICAgICAgICAgIGhkclN1ZiA9IGNvbmZpZy5odG1sLmhlYWRlci5zdWZmaXgsXG4gICAgICAgICAgc3ViSGRyUHJlID0gY29uZmlnLmh0bWwuc3ViaGVkLnByZWZpeCxcbiAgICAgICAgICBzdWJIZHJTdWYgPSBjb25maWcuaHRtbC5zdWJoZWQuc3VmZml4LFxuICAgICAgICAgIHByZSA9IGNvbmZpZy5odG1sLm91dHB1dC5wcmVmaXgsXG4gICAgICAgICAgc3VmID0gY29uZmlnLmh0bWwub3V0cHV0LnN1ZmZpeDtcblxuICAgIC8vIGNvbXBvbmVudCBoZWFkZXJcbiAgICBvdXRwdXQgKz0gaGRyUHJlICsgZmlsZU5hbWUgKyBoZHJTdWY7XG5cbiAgICBpZiAoZGF0YS5vcHRpb25zKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGRhdGEub3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbihrZXksIGluZGV4KSB7XG4gICAgICAgICAgICBvdXRwdXQgKz0gcHJlICsgJzxhIGNsYXNzPVwic2lkZWxpbmtzXCIgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIlwiPicgKyBkYXRhLm9wdGlvbnNba2V5XSArICc8L2E+JyArIHN1ZjtcbiAgICAgICAgICAgIG91dHB1dCArPSAnXFxuJztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEubGlua3MpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoZGF0YS5saW5rcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5saW5rc1trZXldID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLmxpbmtzW2tleV0gPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHN1YiBoZWFkZXJzXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSBzdWJIZHJQcmUgKyBrZXkgKyBzdWJIZHJTdWYgKyAnXFxuJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyByZWd1bGFyIGxpc3QgaXRlbVxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gcHJlICsgJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgZGF0YS5saW5rc1trZXldICsgJ1wiPicgKyBrZXkgKyAnPC9hPicgKyBzdWY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG91dHB1dCArPSAnXFxuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5saW5rc1trZXldID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBwcmU7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZGF0YS5saW5rc1trZXldKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZGV4LCBhcnJheSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpcnN0IG9mIG1hbnkgaXRlbXMgb24gYSBzaW5nbGUgcm93XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJzxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCInICsgZGF0YS5saW5rc1trZXldW2l0ZW1dICsgJ1wiPicgKyBpdGVtICsgJzwvYT4nO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHJlc3Qgb2YgbWFueSBpdGVtcyBvbiBhIHNpbmdsZSByb3dcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSAnIC0gPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicgKyBkYXRhLmxpbmtzW2tleV1baXRlbV0gKyAnXCI+JyArIGl0ZW0uc3Vic3RyaW5nKDAsIDEpICsgJzwvYT4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICdcXG4nO1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBzdWY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cblxufVxuIiwiaW1wb3J0IHtpbnNlcnRIVE1MfSBmcm9tICcuL2luc2VydEhUTUwuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRXTFNzaWRlKHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBvcHRpb25zID0gY29uZmlnLndsc1NpZGUsXG4gICAgICAgIGFyZ3M7XG4gICAgaW5zZXJ0SFRNTChhcmdzID0ge29wdGlvbnMsIGNvbmZpZ30pO1xufVxuIiwiZXhwb3J0IGxldCBjb25maWcgPSB7XG4gICAgaHRtbDoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgIHByZWZpeDogJzxsaT4nLFxuICAgICAgICAgICAgc3VmZml4OiAnPC9saT4nXG4gICAgICAgIH0sXG4gICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICAgcHJlZml4OiAnPGgyPicsXG4gICAgICAgICAgICBzdWZmaXg6ICc8L2gyPidcbiAgICAgICAgfSxcbiAgICAgICAgc3ViaGVkOiB7XG4gICAgICAgICAgICBwcmVmaXg6ICc8aDM+JyxcbiAgICAgICAgICAgIHN1ZmZpeDogJzwvaDM+J1xuICAgICAgICB9XG4gICAgfSxcbiAgICB3bHNPcmRlcjogW1xuICAgICAgICAnaG9ja2V5JyxcbiAgICAgICAgJ2Jhc2ViYWxsJyxcbiAgICAgICAgJ2Zvb3RiYWxsJyxcbiAgICAgICAgJ2dvb2dsZScsXG4gICAgICAgICdkaWdpdGFsJyxcbiAgICAgICAgJ3N0cmVhbScsXG4gICAgICAgICdvdGhlcicsXG4gICAgICAgICdzaWRlJ1xuICAgIF0sXG4gICAgd2xzU2lkZToge1xuICAgICAgICBmaWxlTmFtZTogJ3NpZGUnLFxuICAgICAgICBkZWZhdWx0OiAnYnAnLFxuICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICAnYnAnLFxuICAgICAgICAgICAgJ3RucicsXG4gICAgICAgICAgICAnZGV2MicsXG4gICAgICAgICAgICAnanMnLFxuICAgICAgICAgICAgJ3dwJyxcbiAgICAgICAgICAgICdtbGInLFxuICAgICAgICAgICAgJ21hdGNodXAnXG4gICAgICAgICBdXG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICAgIGJhc2VEaXI6ICcuL2RhdGEvJyxcbiAgICAgICAgZmlsZUV4dDogJy5qc29uJ1xuICAgIH0gXG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldEpTT04ocGFyYW1zKSB7XG4gICAgbGV0IGNhbGxiYWNrID0gcGFyYW1zLmNhbGxiYWNrLFxuICAgICAgICBhcmdzO1xuICAgIGZldGNoKHBhcmFtcy5maWxlKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7IFxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oanNvbikge1xuICAgICAgICBhcmdzID0gcGFyYW1zO1xuICAgICAgICBhcmdzLmpzb24gPSBqc29uO1xuICAgICAgICBjYWxsYmFjayhhcmdzKTtcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7YnVpbGRIVE1MfSBmcm9tICcuL2J1aWxkSFRNTC5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRIVE1MKHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBqc29uLFxuICAgICAgICBmaWxlTmFtZSxcbiAgICAgICAgZWxlbWVudCxcbiAgICAgICAgaHRtbCxcbiAgICAgICAgYXJncyA9IHt9O1xuICAgIGlmIChwYXJhbXMuanNvbikge1xuICAgICAgICBqc29uID0gcGFyYW1zLmpzb24sXG4gICAgICAgIGZpbGVOYW1lID0gcGFyYW1zLmZpbGVOYW1lO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLm9wdGlvbnMpIHtcbiAgICAgICAganNvbiA9IHBhcmFtcy5vcHRpb25zLFxuICAgICAgICBmaWxlTmFtZSA9IGNvbmZpZy53bHNTaWRlLmRlZmF1bHQ7XG4gICAgfVxuICAgIGh0bWwgPSBidWlsZEhUTUwoYXJncyA9IHtqc29uLCBjb25maWcsIGZpbGVOYW1lfSk7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZpbGVOYW1lKTtcbi8vICAgIGNvbnNvbGUubG9nKGZpbGVOYW1lLCBlbGVtZW50KTtcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IGh0bWw7XG59XG4iLCJpbXBvcnQge2dldEpTT059IGZyb20gJy4vZ2V0SlNPTi5qcyc7XG5pbXBvcnQge2luc2VydEhUTUx9IGZyb20gJy4vaW5zZXJ0SFRNTC5qcyc7XG5pbXBvcnQge3BhcnNlQ29tcG9uZW50fSBmcm9tICcuL3BhcnNlQ29tcG9uZW50LmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlbkZvckNsaWNrcyhwYXJhbXMpIHtcbiAgICBsZXQgY2xhc3NOYW1lID0gcGFyYW1zLmNsYXNzTmFtZSxcbiAgICAgICAgbGlua3NUb0NsaWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpLFxuICAgICAgICBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBhcmdzO1xuICAgIGZvciAodmFyIGk9MDsgaTxsaW5rc1RvQ2xpY2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGlua3NUb0NsaWNrW2ldLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAnY2xpY2snLCBcbiAgICAgICAgICAgIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZXQgdGhpc0ZpbGVOYW1lID0gdGhpcy50ZXh0Q29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RoZXNpZGUnKSxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgICAgIHBhcmVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICBjaGlsZC5pZCA9IHRoaXNGaWxlTmFtZTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgICAgIHBhcnNlQ29tcG9uZW50KGFyZ3MgPSB7ZmlsZU5hbWU6IHRoaXNGaWxlTmFtZSwgcGFyZW50OiAndGhlc2lkZScsIGNvbmZpZywgZ2V0SlNPTiwgaW5zZXJ0SFRNTH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtnZXRKU09OfSBmcm9tICcuL2dldEpTT04uanMnO1xuaW1wb3J0IHtpbnNlcnRIVE1MfSBmcm9tICcuL2luc2VydEhUTUwuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDb21wb25lbnQocGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIGZpbGVOYW1lID0gcGFyYW1zLmZpbGVOYW1lLFxuICAgICAgICBwYXJlbnQgPSAocGFyYW1zLnBhcmVudCkgPyBwYXJhbXMucGFyZW50IDogJ2NvbnRlbnQnLFxuICAgICAgICBmaWxlID0gY29uZmlnLmRhdGEuYmFzZURpciArIGZpbGVOYW1lICsgY29uZmlnLmRhdGEuZmlsZUV4dCxcbiAgICAgICAgYXJncztcbiAgICBnZXRKU09OKGFyZ3MgPSB7XG4gICAgICAgIGZpbGVOYW1lLCBcbiAgICAgICAgZmlsZSwgXG4gICAgICAgIGNhbGxiYWNrOiBpbnNlcnRIVE1MLFxuICAgICAgICBwYXJlbnQsIFxuICAgICAgICBjb25maWdcbiAgICB9KTtcbn1cbiJdfQ==
