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
            output += pre + "<a class=\"sidelinks\" href=\"#\">" + data.options[key] + "</a>" + suf;
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
                    output += pre + "<a href=\"" + data.links[key] + "\">" + key + "</a>" + suf;
                }
                output += "\n";
            }
            if (typeof data.links[key] === "object") {
                output += pre;
                Object.keys(data.links[key]).forEach(function (item, index, array) {
                    if (index === 0) {
                        // first of many items on a single row
                        output += "<a href=\"" + data.links[key][item] + "\">" + item + "</a>";
                    } else {
                        // the rest of many items on a single row
                        output += " - <a href=\"" + data.links[key][item] + "\">" + item.substring(0, 1) + "</a>";
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
        baseDir: "http://wls.publicsport.net/",
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
        linksToClick[i].addEventListener("click", function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvYXBwLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2J1aWxkSFRNTC5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9idWlsZFdMU3NpZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvY29uZmlnLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2dldEpTT04uanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvaW5zZXJ0SFRNTC5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9saXN0ZW5Gb3JDbGlja3MuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvcGFyc2VDb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztJQ0FRLE1BQU0sV0FBbUIsYUFBYSxFQUF0QyxNQUFNOztJQUNOLE9BQU8sV0FBa0IsY0FBYyxFQUF2QyxPQUFPOztJQUNQLFVBQVUsV0FBZSxpQkFBaUIsRUFBMUMsVUFBVTs7SUFDVixZQUFZLFdBQWEsbUJBQW1CLEVBQTVDLFlBQVk7O0lBQ1osY0FBYyxXQUFXLHFCQUFxQixFQUE5QyxjQUFjOztJQUNkLGVBQWUsV0FBVSxzQkFBc0IsRUFBL0MsZUFBZTs7QUFFdkIsSUFBSSxJQUFJLEdBQUcsRUFBRTtJQUNULElBQUksWUFBQTtJQUNKLElBQUksWUFBQTtJQUNKLE9BQU8sR0FBRyxLQUFLO0lBQ2YsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQ3pCOztBQUVMLFNBQVMsT0FBTyxHQUFHOztBQUVmLFVBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7O0FBRXRELFlBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDO1lBQzNDLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLGFBQUssQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLGNBQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUIsWUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssTUFBTSxFQUFFO0FBQzFCLDBCQUFjLENBQUMsSUFBSSxHQUFHLEVBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBQyxDQUFDLENBQUM7U0FDakYsTUFBTTtBQUNILGdCQUFJLE9BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQztnQkFDM0MsTUFBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekMsa0JBQUssQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLE9BQU8sV0FBUSxDQUFDOztBQUVsQyxtQkFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFLLENBQUMsQ0FBQztBQUMxQix3QkFBWSxDQUFDLElBQUksR0FBRyxFQUFDLE1BQU0sRUFBTixNQUFNLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBQyxDQUFDLENBQUM7QUFDMUMsMEJBQWMsQ0FBQyxJQUFJLEdBQUcsRUFBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLE9BQU8sV0FBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUMsQ0FBQyxDQUFDO0FBQzFHLDJCQUFlLENBQUMsSUFBSSxHQUFHLEVBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQWQsY0FBYyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxVQUFVLEVBQVYsVUFBVSxFQUFDLENBQUMsQ0FBQztTQUNqRztLQUNKLENBQUMsQ0FBQztDQUNOOztBQUVELE9BQU8sRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FDckNNLFNBQVMsR0FBVCxTQUFTOzs7OztBQUFsQixTQUFTLFNBQVMsQ0FBQyxNQUFNLEVBQUU7O0FBRTlCLFFBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJO1FBQ2xCLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTTtRQUN0QixRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVE7UUFDMUIsSUFBSSxZQUFBO1FBQ0osTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFaEIsUUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtRQUNsQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtRQUNsQyxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtRQUNyQyxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtRQUNyQyxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtRQUMvQixHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOzs7QUFHdEMsVUFBTSxJQUFJLE1BQU0sR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDOztBQUVyQyxRQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDZCxjQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ25ELGtCQUFNLElBQUksR0FBRyxHQUFHLG9DQUFnQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztBQUNwRixrQkFBTSxJQUFJLElBQUksQ0FBQztTQUNsQixDQUFDLENBQUM7QUFDSCxlQUFPLE1BQU0sQ0FBQztLQUNqQjs7QUFFRCxRQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDWixjQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxHQUFHLEVBQUU7QUFDMUMsZ0JBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsRUFBRTtBQUNyQyxvQkFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRTs7QUFFeEIsMEJBQU0sSUFBSSxTQUFTLEdBQUcsR0FBRyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUM7aUJBQ2hELE1BQU07O0FBRUgsMEJBQU0sSUFBSSxHQUFHLEdBQUcsWUFBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSSxHQUFHLEdBQUcsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO2lCQUM3RTtBQUNELHNCQUFNLElBQUksSUFBSSxDQUFDO2FBQ2xCO0FBQ0QsZ0JBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsRUFBRTtBQUNyQyxzQkFBTSxJQUFJLEdBQUcsQ0FBQztBQUNkLHNCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUM5RCx3QkFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFOztBQUViLDhCQUFNLElBQUksWUFBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUM7cUJBQ3hFLE1BQU07O0FBRUgsOEJBQU0sSUFBSSxlQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO3FCQUMzRjtpQkFDSixDQUFDLENBQUM7QUFDSCxzQkFBTSxJQUFJLElBQUksQ0FBQztBQUNmLHNCQUFNLElBQUksR0FBRyxDQUFDO2FBQ2pCO1NBQ0osQ0FBQyxDQUFDO0FBQ0gsZUFBTyxNQUFNLENBQUM7S0FDakI7Q0FFSjs7Ozs7UUN4RGUsWUFBWSxHQUFaLFlBQVk7Ozs7O0FBQXJCLFNBQVMsWUFBWSxDQUFDLE1BQU0sRUFBRTtBQUNqQyxRQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTTtRQUN0QixVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVU7UUFDOUIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPO1FBQ3hCLElBQUksWUFBQSxDQUFDO0FBQ1QsY0FBVSxDQUFDLElBQUksR0FBRyxFQUFDLE9BQU8sRUFBUCxPQUFPLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBQyxDQUFDLENBQUM7Q0FDeEM7Ozs7Ozs7O0FDTk0sSUFBSSxNQUFNLEdBQUc7QUFDaEIsUUFBSSxFQUFFO0FBQ0YsY0FBTSxFQUFFO0FBQ0osa0JBQU0sRUFBRSxNQUFNO0FBQ2Qsa0JBQU0sRUFBRSxPQUFPO1NBQ2xCO0FBQ0QsY0FBTSxFQUFFO0FBQ0osa0JBQU0sRUFBRSxNQUFNO0FBQ2Qsa0JBQU0sRUFBRSxPQUFPO1NBQ2xCO0FBQ0QsY0FBTSxFQUFFO0FBQ0osa0JBQU0sRUFBRSxNQUFNO0FBQ2Qsa0JBQU0sRUFBRSxPQUFPO1NBQ2xCO0tBQ0o7QUFDRCxZQUFRLEVBQUUsQ0FDTixRQUFRLEVBQ1IsVUFBVSxFQUNWLFVBQVUsRUFDVixRQUFRLEVBQ1IsU0FBUyxFQUNULFFBQVEsRUFDUixPQUFPLEVBQ1AsTUFBTSxDQUNUO0FBQ0QsV0FBTyxFQUFFO0FBQ0wsbUJBQVMsSUFBSTtBQUNiLGVBQU8sRUFBRSxDQUNMLElBQUksRUFDSixLQUFLLEVBQ0wsTUFBTSxFQUNOLElBQUksRUFDSixJQUFJLEVBQ0osS0FBSyxFQUNMLFNBQVMsQ0FDWDtLQUNMO0FBQ0QsUUFBSSxFQUFFO0FBQ0YsZUFBTyxFQUFFLDZCQUE2QjtBQUN0QyxlQUFPLEVBQUUsT0FBTztLQUNuQjtDQUNKLENBQUM7UUF6Q1MsTUFBTSxHQUFOLE1BQU07Ozs7O1FDQUQsT0FBTyxHQUFQLE9BQU87Ozs7O0FBQWhCLFNBQVMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUM1QixRQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUTtRQUMxQixJQUFJLFlBQUEsQ0FBQztBQUNULFNBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsUUFBUSxFQUFFO0FBQ3ZDLGVBQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQzFCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFJLEVBQUU7QUFDbkIsWUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNkLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLGdCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbEIsQ0FBQyxDQUFDO0NBQ047Ozs7O1FDUmUsVUFBVSxHQUFWLFVBQVU7Ozs7O0lBRmxCLFNBQVMsV0FBTyxnQkFBZ0IsRUFBaEMsU0FBUzs7QUFFVixTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDL0IsUUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU07UUFDdEIsSUFBSSxZQUFBO1FBQ0osUUFBUSxZQUFBO1FBQ1IsT0FBTyxZQUFBO1FBQ1AsSUFBSSxZQUFBO1FBQ0osSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNkLFFBQUksTUFBTSxDQUFDLElBQUksRUFBRTtBQUNiLFlBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUNsQixRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztLQUM5QjtBQUNELFFBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUNoQixZQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFDckIsUUFBUSxHQUFHLE1BQU0sQ0FBQztLQUNyQjtBQUNELFFBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxHQUFHLEVBQUMsSUFBSSxFQUFKLElBQUksRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUMsQ0FBQyxDQUFDO0FBQ2xELFdBQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVDLFdBQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0NBQzVCOzs7OztRQ3BCZSxlQUFlLEdBQWYsZUFBZTs7Ozs7QUFBeEIsU0FBUyxlQUFlLENBQUMsTUFBTSxFQUFFO0FBQ3BDLFFBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTO1FBQzVCLGNBQWMsR0FBRyxNQUFNLENBQUMsY0FBYztRQUN0QyxZQUFZLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQztRQUN6RCxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU07UUFDdEIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPO1FBQ3hCLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVTtRQUM5QixJQUFJLFlBQUEsQ0FBQztBQUNULFNBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3RDLG9CQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQzVCLE9BQU8sRUFDUCxZQUFXO0FBQ1AsZ0JBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXO2dCQUMvQixNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUM7Z0JBQzNDLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLGtCQUFNLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUN0QixpQkFBSyxDQUFDLEVBQUUsR0FBRyxZQUFZLENBQUM7QUFDeEIsa0JBQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUIsMEJBQWMsQ0FBQyxJQUFJLEdBQUcsRUFBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUMsQ0FBQyxDQUFDO1NBQ25HLEVBQ0QsS0FBSyxDQUNSLENBQUM7S0FDTDtDQUNKOzs7OztRQ3ZCZSxjQUFjLEdBQWQsY0FBYzs7Ozs7QUFBdkIsU0FBUyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQ25DLFFBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNO1FBQ3RCLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUTtRQUMxQixNQUFNLEdBQUcsQUFBQyxNQUFNLENBQUMsTUFBTSxHQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUztRQUNwRCxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTztRQUMzRCxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU87UUFDeEIsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVO1FBQzlCLElBQUksWUFBQSxDQUFDO0FBQ1QsV0FBTyxDQUFDLElBQUksR0FBRztBQUNYLGdCQUFRLEVBQVIsUUFBUTtBQUNSLFlBQUksRUFBSixJQUFJO0FBQ0osZ0JBQVEsRUFBRSxVQUFVO0FBQ3BCLGNBQU0sRUFBTixNQUFNO0FBQ04sY0FBTSxFQUFOLE1BQU07S0FDVCxDQUFDLENBQUM7Q0FDTiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge2NvbmZpZ30gICAgICAgICAgICAgZnJvbSAnLi9qcy9jb25maWcnO1xuaW1wb3J0IHtnZXRKU09OfSAgICAgICAgICAgIGZyb20gJy4vanMvZ2V0SlNPTic7XG5pbXBvcnQge2luc2VydEhUTUx9ICAgICAgICAgZnJvbSAnLi9qcy9pbnNlcnRIVE1MJztcbmltcG9ydCB7YnVpbGRXTFNzaWRlfSAgICAgICBmcm9tICcuL2pzL2J1aWxkV0xTc2lkZSc7XG5pbXBvcnQge3BhcnNlQ29tcG9uZW50fSAgICAgZnJvbSAnLi9qcy9wYXJzZUNvbXBvbmVudCc7XG5pbXBvcnQge2xpc3RlbkZvckNsaWNrc30gICAgZnJvbSAnLi9qcy9saXN0ZW5Gb3JDbGlja3MnO1xuXG5sZXQgaHRtbCA9ICcnLFxuICAgIGpzb24sXG4gICAgYXJncyxcbiAgICBpc0Vycm9yID0gZmFsc2UsXG4gICAgd2xzT3JkZXIgPSBjb25maWcud2xzT3JkZXJcbiAgICA7XG5cbmZ1bmN0aW9uIGluaXRXTFMoKSB7XG4gICAgLy8gYWRkIGJhc2UgY29tcG9uZW50cyBhcyBkZXRlcm1pbmVkIGJ5IGNvbmZpZyBvcmRlclxuICAgIE9iamVjdC5rZXlzKHdsc09yZGVyKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgIC8vIG9yZGVyIGlzIGltcG9ydGFudCBzbyB3ZSBjcmVhdGUgb3VyIGRvbSBlbGVtZW50cyBoZXJlIHRvIHByZXNlcnZlIG9yZGVyXG4gICAgICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGVudCcpLFxuICAgICAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICBjaGlsZC5pZCA9IHdsc09yZGVyW2tleV07XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgIGlmICh3bHNPcmRlcltrZXldICE9PSAnc2lkZScpIHtcbiAgICAgICAgICAgIHBhcnNlQ29tcG9uZW50KGFyZ3MgPSB7ZmlsZU5hbWU6IHdsc09yZGVyW2tleV0sIGNvbmZpZywgZ2V0SlNPTiwgaW5zZXJ0SFRNTH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aGVzaWRlJyksXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgY2hpbGQuaWQgPSBjb25maWcud2xzU2lkZS5kZWZhdWx0O1xuICAgICAgICAgICAgLy8gdG9kbyBpZiBkZWZhdWx0IGlzIG5vdCBpbiBhcnJheSBvZiByZWd1bGFyIG9yZGVyXG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgYnVpbGRXTFNzaWRlKGFyZ3MgPSB7Y29uZmlnLCBpbnNlcnRIVE1MfSk7XG4gICAgICAgICAgICBwYXJzZUNvbXBvbmVudChhcmdzID0ge2ZpbGVOYW1lOiBjb25maWcud2xzU2lkZS5kZWZhdWx0LCBwYXJlbnQ6ICd0aGVzaWRlJywgY29uZmlnLCBnZXRKU09OLCBpbnNlcnRIVE1MfSk7XG4gICAgICAgICAgICBsaXN0ZW5Gb3JDbGlja3MoYXJncyA9IHtjbGFzc05hbWU6ICdzaWRlbGlua3MnLCBwYXJzZUNvbXBvbmVudCwgY29uZmlnLCBnZXRKU09OLCBpbnNlcnRIVE1MfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuaW5pdFdMUygpO1xuXG4vKiB0b2RvXG5nZXQgcmlkIG9mICMgb25jbGlja1xub3BlbiBsaW5rcyBpbiBuZXcgdGFic1xuLy9zZXQgc2lkZSB0b2dnbGVcbmlzIG5vIG1hc29ucnkgb2tcbnN0YXJ0IG5ldyBjc3NcbnNlcnZpY2Ugd29ya2VyXG5jb25uZWN0IHRvIGdzaGVldCB0YWJzXG4qL1xuXG4vLyBmdW5jdGlvbiBzZXRNYXNvbnJ5KCkge1xuLy8gICAgIHZhciBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRlbnQnKTtcbi8vICAgICB2YXIgbXNucnkgPSBuZXcgTWFzb25yeSggZWxlbSwge1xuLy8gICAgICAgaXRlbVNlbGVjdG9yOiAndWwnXG4vLyAgICAgfSk7XG4vLyB9XG4iLCJleHBvcnQgZnVuY3Rpb24gYnVpbGRIVE1MKHBhcmFtcykge1xuXG4gICAgbGV0IGRhdGEgPSBwYXJhbXMuanNvbixcbiAgICAgICAgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAgZmlsZU5hbWUgPSBwYXJhbXMuZmlsZU5hbWUsXG4gICAgICAgIGFyZ3MsXG4gICAgICAgIG91dHB1dCA9ICcnO1xuXG4gICAgY29uc3QgaGRyUHJlID0gY29uZmlnLmh0bWwuaGVhZGVyLnByZWZpeCxcbiAgICAgICAgICBoZHJTdWYgPSBjb25maWcuaHRtbC5oZWFkZXIuc3VmZml4LFxuICAgICAgICAgIHN1YkhkclByZSA9IGNvbmZpZy5odG1sLnN1YmhlZC5wcmVmaXgsXG4gICAgICAgICAgc3ViSGRyU3VmID0gY29uZmlnLmh0bWwuc3ViaGVkLnN1ZmZpeCxcbiAgICAgICAgICBwcmUgPSBjb25maWcuaHRtbC5vdXRwdXQucHJlZml4LFxuICAgICAgICAgIHN1ZiA9IGNvbmZpZy5odG1sLm91dHB1dC5zdWZmaXg7XG5cbiAgICAvLyBjb21wb25lbnQgaGVhZGVyXG4gICAgb3V0cHV0ICs9IGhkclByZSArIGZpbGVOYW1lICsgaGRyU3VmO1xuXG4gICAgaWYgKGRhdGEub3B0aW9ucykge1xuICAgICAgICBPYmplY3Qua2V5cyhkYXRhLm9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpbmRleCkge1xuICAgICAgICAgICAgb3V0cHV0ICs9IHByZSArICc8YSBjbGFzcz1cInNpZGVsaW5rc1wiIGhyZWY9XCIjXCI+JyArIGRhdGEub3B0aW9uc1trZXldICsgJzwvYT4nICsgc3VmO1xuICAgICAgICAgICAgb3V0cHV0ICs9ICdcXG4nO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5saW5rcykge1xuICAgICAgICBPYmplY3Qua2V5cyhkYXRhLmxpbmtzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLmxpbmtzW2tleV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubGlua3Nba2V5XSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc3ViIGhlYWRlcnNcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHN1YkhkclByZSArIGtleSArIHN1YkhkclN1ZiArICdcXG4nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlZ3VsYXIgbGlzdCBpdGVtXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSBwcmUgKyAnPGEgaHJlZj1cIicgKyBkYXRhLmxpbmtzW2tleV0gKyAnXCI+JyArIGtleSArICc8L2E+JyArIHN1ZjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICdcXG4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLmxpbmtzW2tleV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IHByZTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhkYXRhLmxpbmtzW2tleV0pLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3Qgb2YgbWFueSBpdGVtcyBvbiBhIHNpbmdsZSByb3dcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSAnPGEgaHJlZj1cIicgKyBkYXRhLmxpbmtzW2tleV1baXRlbV0gKyAnXCI+JyArIGl0ZW0gKyAnPC9hPic7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgcmVzdCBvZiBtYW55IGl0ZW1zIG9uIGEgc2luZ2xlIHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9ICcgLSA8YSBocmVmPVwiJyArIGRhdGEubGlua3Nba2V5XVtpdGVtXSArICdcIj4nICsgaXRlbS5zdWJzdHJpbmcoMCwgMSkgKyAnPC9hPic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ1xcbic7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IHN1ZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYnVpbGRXTFNzaWRlKHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBpbnNlcnRIVE1MID0gcGFyYW1zLmluc2VydEhUTUwsXG4gICAgICAgIG9wdGlvbnMgPSBjb25maWcud2xzU2lkZSxcbiAgICAgICAgYXJncztcbiAgICBpbnNlcnRIVE1MKGFyZ3MgPSB7b3B0aW9ucywgY29uZmlnfSk7XG59XG4iLCJleHBvcnQgbGV0IGNvbmZpZyA9IHtcbiAgICBodG1sOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgcHJlZml4OiAnPGxpPicsXG4gICAgICAgICAgICBzdWZmaXg6ICc8L2xpPidcbiAgICAgICAgfSxcbiAgICAgICAgaGVhZGVyOiB7XG4gICAgICAgICAgICBwcmVmaXg6ICc8aDI+JyxcbiAgICAgICAgICAgIHN1ZmZpeDogJzwvaDI+J1xuICAgICAgICB9LFxuICAgICAgICBzdWJoZWQ6IHtcbiAgICAgICAgICAgIHByZWZpeDogJzxoMz4nLFxuICAgICAgICAgICAgc3VmZml4OiAnPC9oMz4nXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHdsc09yZGVyOiBbXG4gICAgICAgICdob2NrZXknLFxuICAgICAgICAnYmFzZWJhbGwnLFxuICAgICAgICAnZm9vdGJhbGwnLFxuICAgICAgICAnZ29vZ2xlJyxcbiAgICAgICAgJ2RpZ2l0YWwnLFxuICAgICAgICAnc3RyZWFtJyxcbiAgICAgICAgJ290aGVyJyxcbiAgICAgICAgJ3NpZGUnXG4gICAgXSxcbiAgICB3bHNTaWRlOiB7XG4gICAgICAgIGRlZmF1bHQ6ICdicCcsXG4gICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICAgICdicCcsXG4gICAgICAgICAgICAndG5yJyxcbiAgICAgICAgICAgICdkZXYyJyxcbiAgICAgICAgICAgICdqcycsXG4gICAgICAgICAgICAnd3AnLFxuICAgICAgICAgICAgJ21sYicsXG4gICAgICAgICAgICAnbWF0Y2h1cCdcbiAgICAgICAgIF1cbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgICAgYmFzZURpcjogJ2h0dHA6Ly93bHMucHVibGljc3BvcnQubmV0LycsXG4gICAgICAgIGZpbGVFeHQ6ICcuanNvbidcbiAgICB9IFxufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRKU09OKHBhcmFtcykge1xuICAgIGxldCBjYWxsYmFjayA9IHBhcmFtcy5jYWxsYmFjayxcbiAgICAgICAgYXJncztcbiAgICBmZXRjaChwYXJhbXMuZmlsZSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkgeyBcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgYXJncyA9IHBhcmFtcztcbiAgICAgICAgYXJncy5qc29uID0ganNvbjtcbiAgICAgICAgY2FsbGJhY2soYXJncyk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQge2J1aWxkSFRNTH0gZnJvbSAnLi9idWlsZEhUTUwuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0SFRNTChwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAganNvbixcbiAgICAgICAgZmlsZU5hbWUsXG4gICAgICAgIGVsZW1lbnQsXG4gICAgICAgIGh0bWwsXG4gICAgICAgIGFyZ3MgPSB7fTtcbiAgICBpZiAocGFyYW1zLmpzb24pIHtcbiAgICAgICAganNvbiA9IHBhcmFtcy5qc29uLFxuICAgICAgICBmaWxlTmFtZSA9IHBhcmFtcy5maWxlTmFtZTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5vcHRpb25zKSB7XG4gICAgICAgIGpzb24gPSBwYXJhbXMub3B0aW9ucyxcbiAgICAgICAgZmlsZU5hbWUgPSAnc2lkZSc7XG4gICAgfVxuICAgIGh0bWwgPSBidWlsZEhUTUwoYXJncyA9IHtqc29uLCBjb25maWcsIGZpbGVOYW1lfSk7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZpbGVOYW1lKTtcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IGh0bWw7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gbGlzdGVuRm9yQ2xpY2tzKHBhcmFtcykge1xuICAgIGxldCBjbGFzc05hbWUgPSBwYXJhbXMuY2xhc3NOYW1lLFxuICAgICAgICBwYXJzZUNvbXBvbmVudCA9IHBhcmFtcy5wYXJzZUNvbXBvbmVudCxcbiAgICAgICAgbGlua3NUb0NsaWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpLFxuICAgICAgICBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBnZXRKU09OID0gcGFyYW1zLmdldEpTT04sXG4gICAgICAgIGluc2VydEhUTUwgPSBwYXJhbXMuaW5zZXJ0SFRNTCxcbiAgICAgICAgYXJncztcbiAgICBmb3IgKHZhciBpPTA7IGk8bGlua3NUb0NsaWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxpbmtzVG9DbGlja1tpXS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgJ2NsaWNrJywgXG4gICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBsZXQgdGhpc0ZpbGVOYW1lID0gdGhpcy50ZXh0Q29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RoZXNpZGUnKSxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgICAgIHBhcmVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICBjaGlsZC5pZCA9IHRoaXNGaWxlTmFtZTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgICAgIHBhcnNlQ29tcG9uZW50KGFyZ3MgPSB7ZmlsZU5hbWU6IHRoaXNGaWxlTmFtZSwgcGFyZW50OiAndGhlc2lkZScsIGNvbmZpZywgZ2V0SlNPTiwgaW5zZXJ0SFRNTH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ29tcG9uZW50KHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBmaWxlTmFtZSA9IHBhcmFtcy5maWxlTmFtZSxcbiAgICAgICAgcGFyZW50ID0gKHBhcmFtcy5wYXJlbnQpID8gcGFyYW1zLnBhcmVudCA6ICdjb250ZW50JyxcbiAgICAgICAgZmlsZSA9IGNvbmZpZy5kYXRhLmJhc2VEaXIgKyBmaWxlTmFtZSArIGNvbmZpZy5kYXRhLmZpbGVFeHQsXG4gICAgICAgIGdldEpTT04gPSBwYXJhbXMuZ2V0SlNPTixcbiAgICAgICAgaW5zZXJ0SFRNTCA9IHBhcmFtcy5pbnNlcnRIVE1MLFxuICAgICAgICBhcmdzO1xuICAgIGdldEpTT04oYXJncyA9IHtcbiAgICAgICAgZmlsZU5hbWUsIFxuICAgICAgICBmaWxlLCBcbiAgICAgICAgY2FsbGJhY2s6IGluc2VydEhUTUwsXG4gICAgICAgIHBhcmVudCwgXG4gICAgICAgIGNvbmZpZ1xuICAgIH0pO1xufVxuIl19
