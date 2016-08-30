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
        options: ["bp", "tnr", "dev2", "js", "wp", "mlb", "travel", "money", "matchup-mlb", "matchup-nhl", "matchup-cfb"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvYXBwLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvZGF0YS9jb25maWcuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvYnVpbGRIVE1MLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2J1aWxkV0xTc2lkZS5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9nZXRKU09OLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2dldFBhcmFtZXRlckJ5TmFtZS5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9pbnNlcnRIVE1MLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2xpc3RlbkZvckNsaWNrcy5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9wYXJzZUNvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0lDQVEsTUFBTSxXQUFtQixnQkFBZ0IsRUFBekMsTUFBTTs7SUFDTixZQUFZLFdBQWEsbUJBQW1CLEVBQTVDLFlBQVk7O0lBQ1osY0FBYyxXQUFXLHFCQUFxQixFQUE5QyxjQUFjOztJQUNkLGVBQWUsV0FBVSxzQkFBc0IsRUFBL0MsZUFBZTs7SUFDZixrQkFBa0IsV0FBTyx5QkFBeUIsRUFBbEQsa0JBQWtCOztBQUUxQixJQUFJLElBQUksR0FBRyxFQUFFO0lBQ1QsSUFBSSxZQUFBO0lBQ0osSUFBSSxZQUFBO0lBQ0osT0FBTyxHQUFHLEtBQUs7SUFDZixRQUFRLEdBQUcsTUFBTSxDQUFD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TSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDdEIsaUJBQUssQ0FBQyxFQUFFLEdBQUcsWUFBWSxDQUFDO0FBQ3hCLGtCQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLDBCQUFjLENBQUMsSUFBSSxHQUFHLEVBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxVQUFVLEVBQVYsVUFBVSxFQUFDLENBQUMsQ0FBQztTQUNuRyxFQUNELEtBQUssQ0FDUixDQUFDO0tBQ0w7Q0FDSjs7Ozs7UUN0QmUsY0FBYyxHQUFkLGNBQWM7Ozs7O0lBSHRCLE9BQU8sV0FBTyxjQUFjLEVBQTVCLE9BQU87O0lBQ1AsVUFBVSxXQUFPLGlCQUFpQixFQUFsQyxVQUFVOztBQUVYLFNBQVMsY0FBYyxDQUFDLE1BQU0sRUFBRTtBQUNuQyxRQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTTtRQUN0QixRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVE7UUFDMUIsTUFBTSxHQUFHLEFBQUMsTUFBTSxDQUFDLE1BQU0sR0FBSSxNQUFNLENBQUMsTUFBTSxHQUFHLFNBQVM7UUFDcEQsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU87UUFDM0QsSUFBSSxZQUFBLENBQUM7QUFDVCxXQUFPLENBQUMsSUFBSSxHQUFHO0FBQ1gsZ0JBQVEsRUFBUixRQUFRO0FBQ1IsWUFBSSxFQUFKLElBQUk7QUFDSixnQkFBUSxFQUFFLFVBQVU7QUFDcEIsY0FBTSxFQUFOLE1BQU07QUFDTixjQUFNLEVBQU4sTUFBTTtLQUNULENBQUMsQ0FBQztDQUNOIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7Y29uZmlnfSAgICAgICAgICAgICBmcm9tICcuLi9kYXRhL2NvbmZpZyc7XG5pbXBvcnQge2J1aWxkV0xTc2lkZX0gICAgICAgZnJvbSAnLi9qcy9idWlsZFdMU3NpZGUnO1xuaW1wb3J0IHtwYXJzZUNvbXBvbmVudH0gICAgIGZyb20gJy4vanMvcGFyc2VDb21wb25lbnQnO1xuaW1wb3J0IHtsaXN0ZW5Gb3JDbGlja3N9ICAgIGZyb20gJy4vanMvbGlzdGVuRm9yQ2xpY2tzJztcbmltcG9ydCB7Z2V0UGFyYW1ldGVyQnlOYW1lfSBmcm9tICcuL2pzL2dldFBhcmFtZXRlckJ5TmFtZSc7XG5cbmxldCBodG1sID0gJycsXG4gICAganNvbixcbiAgICBhcmdzLFxuICAgIGlzRXJyb3IgPSBmYWxzZSxcbiAgICB3bHNPcmRlciA9IGNvbmZpZy53bHNPcmRlclxuICAgIDtcblxuZnVuY3Rpb24gaW5pdFdMUygpIHtcbiAgICAvLyBhZGQgYmFzZSBjb21wb25lbnRzIGFzIGRldGVybWluZWQgYnkgY29uZmlnIG9yZGVyXG4gICAgT2JqZWN0LmtleXMod2xzT3JkZXIpLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpbmRleCwgYXJyYXkpIHtcbiAgICAgICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250ZW50JyksXG4gICAgICAgICAgICBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyksXG4gICAgICAgICAgICBzaWRlRGVmYXVsdEZpbGVOYW1lO1xuICAgICAgICBjaGlsZC5pZCA9IHdsc09yZGVyW2tleV07XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgIGlmICh3bHNPcmRlcltrZXldID09PSAnc2lkZScpIHtcbiAgICAgICAgICAgIC8vIHRvZG8gbWFrZSBzdXJlIHNpZGUgZGVmYXVsdCBjb21wIGlzIG5vdCBpbiBhcnJheSBvZiByZWd1bGFyIG9yZGVyXG4gICAgICAgICAgICBsZXQgcHJlbG9hZENvbXBvbmVudCA9IGdldFBhcmFtZXRlckJ5TmFtZSh7a2V5OidjJ30pXG4gICAgICAgICAgICBpZiAocHJlbG9hZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgIC8vIEB0b2RvOiB1c2UgW10uZmlsdGVyIGhlcmUgZm9yIGlucHV0IGNoZWNraW5nXG4gICAgICAgICAgICAgICAgc2lkZURlZmF1bHRGaWxlTmFtZSA9IHByZWxvYWRDb21wb25lbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNpZGVEZWZhdWx0RmlsZU5hbWUgPSBjb25maWcud2xzU2lkZS5kZWZhdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnVpbGRXTFNzaWRlKGFyZ3MgPSB7ZmlsZU5hbWU6IHNpZGVEZWZhdWx0RmlsZU5hbWUsIGNvbmZpZ30pO1xuICAgICAgICAgICAgcGFyc2VDb21wb25lbnQoYXJncyA9IHtmaWxlTmFtZTogc2lkZURlZmF1bHRGaWxlTmFtZSwgcGFyZW50OiAndGhlc2lkZScsIGNvbmZpZ30pO1xuICAgICAgICAgICAgbGlzdGVuRm9yQ2xpY2tzKGFyZ3MgPSB7Y2xhc3NOYW1lOiAnc2lkZWxpbmtzJywgY29uZmlnfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJzZUNvbXBvbmVudChhcmdzID0ge2ZpbGVOYW1lOiB3bHNPcmRlcltrZXldLCBjb25maWd9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5pbml0V0xTKCk7XG5cbi8qIHRvZG9cbnN0YXJ0IG5ldyBjc3MgYnVpbGRcbnNlcnZpY2Ugd29ya2VyXG4vL2dldCByaWQgb2YgIyBvbmNsaWNrXG4vL29wZW4gbGlua3MgaW4gbmV3IHRhYnNcbi8vc2V0IHNpZGUgdG9nZ2xlXG5lbmhhbmNlbWVudHM6XG5hZGQgbWFzb25yeSBvcHRpb246IG9ubHkgbG9hZCBpbiBkZXNrdG9wLCB0dXJuIG9uL29mZiwga2VlcCBvbiBmb3IgYWxsIGRldmljZXMsIGNzcyBtYXNvbnJ5IChodHRwOi8vdzNiaXRzLmNvbS9jc3MtbWFzb25yeS8pXG5jb25uZWN0IHRvIGdzaGVldCB0YWJzXG4vL2xvYWQgc2lkZSB2aWEgdXJsIHBhcmFtXG4qL1xuXG4vL1xuLy8gZnVuY3Rpb24gc2V0TWFzb25yeSgpIHtcbi8vICAgICB2YXIgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50Jyk7XG4vLyAgICAgdmFyIG1zbnJ5ID0gbmV3IE1hc29ucnkoIGVsZW0sIHtcbi8vICAgICAgIGl0ZW1TZWxlY3RvcjogJ3VsJ1xuLy8gICAgIH0pO1xuLy8gfVxuIiwiZXhwb3J0IGxldCBjb25maWcgPSB7XG4gICAgaHRtbDoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgIHByZWZpeDogJzxsaT4nLFxuICAgICAgICAgICAgc3VmZml4OiAnPC9saT4nXG4gICAgICAgIH0sXG4gICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICAgcHJlZml4OiAnPGgyPicsXG4gICAgICAgICAgICBzdWZmaXg6ICc8L2gyPidcbiAgICAgICAgfSxcbiAgICAgICAgc3ViaGVkOiB7XG4gICAgICAgICAgICBwcmVmaXg6ICc8aDM+JyxcbiAgICAgICAgICAgIHN1ZmZpeDogJzwvaDM+J1xuICAgICAgICB9XG4gICAgfSxcbiAgICB3bHNPcmRlcjogW1xuICAgICAgICAnaG9ja2V5JyxcbiAgICAgICAgJ2Jhc2ViYWxsJyxcbiAgICAgICAgJ2Zvb3RiYWxsJyxcbiAgICAgICAgJ2dvb2dsZScsXG4gICAgICAgICdkaWdpdGFsJyxcbiAgICAgICAgJ3N0cmVhbScsXG4gICAgICAgICdvdGhlcicsXG4gICAgICAgICdzaWRlJ1xuICAgIF0sXG4gICAgd2xzU2lkZToge1xuICAgICAgICBmaWxlTmFtZTogJ3NpZGUnLFxuICAgICAgICBkZWZhdWx0OiAnYnAnLFxuICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICAnYnAnLFxuICAgICAgICAgICAgJ3RucicsXG4gICAgICAgICAgICAnZGV2MicsXG4gICAgICAgICAgICAnanMnLFxuICAgICAgICAgICAgJ3dwJyxcbiAgICAgICAgICAgICdtbGInLFxuICAgICAgICAgICAgJ3RyYXZlbCcsXG4gICAgICAgICAgICAnbW9uZXknLFxuICAgICAgICAgICAgJ21hdGNodXAtbWxiJyxcbiAgICAgICAgICAgICdtYXRjaHVwLW5obCcsXG4gICAgICAgICAgICAnbWF0Y2h1cC1jZmInXG4gICAgICAgICBdXG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICAgIGJhc2VEaXI6ICcuL2RhdGEvJyxcbiAgICAgICAgZmlsZUV4dDogJy5qc29uJ1xuICAgIH0gXG59O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkSFRNTChwYXJhbXMpIHtcblxuICAgIGxldCBkYXRhID0gcGFyYW1zLmpzb24sXG4gICAgICAgIGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIGZpbGVOYW1lID0gcGFyYW1zLmZpbGVOYW1lLFxuICAgICAgICBhcmdzLFxuICAgICAgICBvdXRwdXQgPSAnJztcblxuICAgIGNvbnN0IGhkclByZSA9IGNvbmZpZy5odG1sLmhlYWRlci5wcmVmaXgsXG4gICAgICAgICAgaGRyU3VmID0gY29uZmlnLmh0bWwuaGVhZGVyLnN1ZmZpeCxcbiAgICAgICAgICBzdWJIZHJQcmUgPSBjb25maWcuaHRtbC5zdWJoZWQucHJlZml4LFxuICAgICAgICAgIHN1YkhkclN1ZiA9IGNvbmZpZy5odG1sLnN1YmhlZC5zdWZmaXgsXG4gICAgICAgICAgcHJlID0gY29uZmlnLmh0bWwub3V0cHV0LnByZWZpeCxcbiAgICAgICAgICBzdWYgPSBjb25maWcuaHRtbC5vdXRwdXQuc3VmZml4O1xuXG4gICAgLy8gY29tcG9uZW50IGhlYWRlclxuICAgIG91dHB1dCArPSBoZHJQcmUgKyBmaWxlTmFtZSArIGhkclN1ZjtcblxuICAgIGlmIChkYXRhLm9wdGlvbnMpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoZGF0YS5vcHRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaW5kZXgpIHtcbiAgICAgICAgICAgIG91dHB1dCArPSBwcmUgKyAnPGEgY2xhc3M9XCJzaWRlbGlua3NcIiB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiXCI+JyArIGRhdGEub3B0aW9uc1trZXldICsgJzwvYT4nICsgc3VmO1xuICAgICAgICAgICAgb3V0cHV0ICs9ICdcXG4nO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5saW5rcykge1xuICAgICAgICBPYmplY3Qua2V5cyhkYXRhLmxpbmtzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLmxpbmtzW2tleV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubGlua3Nba2V5XSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc3ViIGhlYWRlcnNcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHN1YkhkclByZSArIGtleSArIHN1YkhkclN1ZiArICdcXG4nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlZ3VsYXIgbGlzdCBpdGVtXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSBwcmUgKyAnPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicgKyBkYXRhLmxpbmtzW2tleV0gKyAnXCI+JyArIGtleSArICc8L2E+JyArIHN1ZjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICdcXG4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLmxpbmtzW2tleV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IHByZTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhkYXRhLmxpbmtzW2tleV0pLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3Qgb2YgbWFueSBpdGVtcyBvbiBhIHNpbmdsZSByb3dcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSAnPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicgKyBkYXRhLmxpbmtzW2tleV1baXRlbV0gKyAnXCI+JyArIGl0ZW0gKyAnPC9hPic7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgcmVzdCBvZiBtYW55IGl0ZW1zIG9uIGEgc2luZ2xlIHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9ICcgLSA8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIGRhdGEubGlua3Nba2V5XVtpdGVtXSArICdcIj4nICsgaXRlbS5zdWJzdHJpbmcoMCwgMSkgKyAnPC9hPic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ1xcbic7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IHN1ZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQge2luc2VydEhUTUx9IGZyb20gJy4vaW5zZXJ0SFRNTC5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFdMU3NpZGUocGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIG9wdGlvbnMgPSBjb25maWcud2xzU2lkZSxcbiAgICAgICAgYXJncyxcbiAgICAgICAgZmlsZU5hbWUsXG4gICAgICAgIHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aGVzaWRlJyksXG4gICAgICAgIGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICBmaWxlTmFtZSA9IChwYXJhbXMuZmlsZU5hbWUpID8gcGFyYW1zLmZpbGVOYW1lIDogY29uZmlnLndsc1NpZGUuZGVmYXVsdDtcbiAgICBjaGlsZC5pZCA9IGZpbGVOYW1lO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgaW5zZXJ0SFRNTChhcmdzID0ge29wdGlvbnMsIGNvbmZpZ30pO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldEpTT04ocGFyYW1zKSB7XG4gICAgbGV0IGNhbGxiYWNrID0gcGFyYW1zLmNhbGxiYWNrLFxuICAgICAgICBhcmdzO1xuICAgIGZldGNoKHBhcmFtcy5maWxlKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7IFxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24oanNvbikge1xuICAgICAgICBhcmdzID0gcGFyYW1zO1xuICAgICAgICBhcmdzLmpzb24gPSBqc29uO1xuICAgICAgICBjYWxsYmFjayhhcmdzKTtcbiAgICB9KTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRQYXJhbWV0ZXJCeU5hbWUocGFyYW1zKSB7XG4gICAgbGV0IGtleSwgXG4gICAgICAgIHVybDtcbiAgICBrZXkgPSBwYXJhbXMua2V5O1xuICAgIHVybCA9IChwYXJhbXMudXJsKSA/IHBhcmFtcy51cmwgOiB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICBrZXkgPSBrZXkucmVwbGFjZSgvW1xcW1xcXV0vZywgXCJcXFxcJCZcIik7XG4gICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIls/Jl1cIiArIGtleSArIFwiKD0oW14mI10qKXwmfCN8JClcIiksXG4gICAgICAgIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XG4gICAgaWYgKCFyZXN1bHRzKSByZXR1cm4gbnVsbDtcbiAgICBpZiAoIXJlc3VsdHNbMl0pIHJldHVybiAnJztcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKSk7XG59XG4iLCJpbXBvcnQge2J1aWxkSFRNTH0gZnJvbSAnLi9idWlsZEhUTUwuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0SFRNTChwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAganNvbixcbiAgICAgICAgZmlsZU5hbWUsXG4gICAgICAgIGVsZW1lbnQsXG4gICAgICAgIGh0bWwsXG4gICAgICAgIGFyZ3MgPSB7fTtcbiAgICBpZiAocGFyYW1zLmpzb24pIHtcbiAgICAgICAganNvbiA9IHBhcmFtcy5qc29uLFxuICAgICAgICBmaWxlTmFtZSA9IHBhcmFtcy5maWxlTmFtZTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5vcHRpb25zKSB7XG4gICAgICAgIGpzb24gPSBwYXJhbXMub3B0aW9ucyxcbiAgICAgICAgZmlsZU5hbWUgPSAnc2lkZSc7XG4gICAgfVxuICAgIGh0bWwgPSBidWlsZEhUTUwoYXJncyA9IHtqc29uLCBjb25maWcsIGZpbGVOYW1lfSk7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZpbGVOYW1lKTtcbi8vICAgIGNvbnNvbGUubG9nKGZpbGVOYW1lLCBlbGVtZW50KTtcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IGh0bWw7XG59XG4iLCJpbXBvcnQge2dldEpTT059IGZyb20gJy4vZ2V0SlNPTi5qcyc7XG5pbXBvcnQge2luc2VydEhUTUx9IGZyb20gJy4vaW5zZXJ0SFRNTC5qcyc7XG5pbXBvcnQge3BhcnNlQ29tcG9uZW50fSBmcm9tICcuL3BhcnNlQ29tcG9uZW50LmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlbkZvckNsaWNrcyhwYXJhbXMpIHtcbiAgICBsZXQgY2xhc3NOYW1lID0gcGFyYW1zLmNsYXNzTmFtZSxcbiAgICAgICAgbGlua3NUb0NsaWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpLFxuICAgICAgICBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBhcmdzO1xuICAgIGZvciAodmFyIGk9MDsgaTxsaW5rc1RvQ2xpY2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGlua3NUb0NsaWNrW2ldLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAnY2xpY2snLCBcbiAgICAgICAgICAgIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBsZXQgdGhpc0ZpbGVOYW1lID0gdGhpcy50ZXh0Q29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RoZXNpZGUnKSxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgICAgIHBhcmVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICBjaGlsZC5pZCA9IHRoaXNGaWxlTmFtZTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgICAgIHBhcnNlQ29tcG9uZW50KGFyZ3MgPSB7ZmlsZU5hbWU6IHRoaXNGaWxlTmFtZSwgcGFyZW50OiAndGhlc2lkZScsIGNvbmZpZywgZ2V0SlNPTiwgaW5zZXJ0SFRNTH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtnZXRKU09OfSBmcm9tICcuL2dldEpTT04uanMnO1xuaW1wb3J0IHtpbnNlcnRIVE1MfSBmcm9tICcuL2luc2VydEhUTUwuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDb21wb25lbnQocGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIGZpbGVOYW1lID0gcGFyYW1zLmZpbGVOYW1lLFxuICAgICAgICBwYXJlbnQgPSAocGFyYW1zLnBhcmVudCkgPyBwYXJhbXMucGFyZW50IDogJ2NvbnRlbnQnLFxuICAgICAgICBmaWxlID0gY29uZmlnLmRhdGEuYmFzZURpciArIGZpbGVOYW1lICsgY29uZmlnLmRhdGEuZmlsZUV4dCxcbiAgICAgICAgYXJncztcbiAgICBnZXRKU09OKGFyZ3MgPSB7XG4gICAgICAgIGZpbGVOYW1lLCBcbiAgICAgICAgZmlsZSwgXG4gICAgICAgIGNhbGxiYWNrOiBpbnNlcnRIVE1MLFxuICAgICAgICBwYXJlbnQsIFxuICAgICAgICBjb25maWdcbiAgICB9KTtcbn1cbiJdfQ==
