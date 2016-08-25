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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvYXBwLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2J1aWxkSFRNTC5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9idWlsZFdMU3NpZGUuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvY29uZmlnLmpzIiwiL1VzZXJzL2p1c3RlbmZveC9Eb2N1bWVudHMvcmVwby93bHMvc3JjL2pzL2dldEpTT04uanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvaW5zZXJ0SFRNTC5qcyIsIi9Vc2Vycy9qdXN0ZW5mb3gvRG9jdW1lbnRzL3JlcG8vd2xzL3NyYy9qcy9saXN0ZW5Gb3JDbGlja3MuanMiLCIvVXNlcnMvanVzdGVuZm94L0RvY3VtZW50cy9yZXBvL3dscy9zcmMvanMvcGFyc2VDb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztJQ0FRLE1BQU0sV0FBbUIsYUFBYSxFQUF0QyxNQUFNOztJQUNOLFlBQVksV0FBYSxtQkFBbUIsRUFBNUMsWUFBWTs7SUFDWixjQUFjLFdBQVcscUJBQXFCLEVBQTlDLGNBQWM7O0lBQ2QsZUFBZSxXQUFVLHNCQUFzQixFQUEvQyxlQUFlOztBQUV2QixJQUFJLElBQUksR0FBRyxFQUFFO0lBQ1QsSUFBSSxZQUFBO0lBQ0osSUFBSSxZQUFBO0lBQ0osT0FBTyxHQUFHLEtBQUs7SUFDZixRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FDekI7O0FBRUwsU0FBUyxPQUFPLEdBQUc7O0FBRWYsVUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxHQUFHLEVBQUUsS0FBSyxF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RSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRSxVQUFVLEVBQVYsVUFBVSxFQUFDLENBQUMsQ0FBQztTQUNuRyxFQUNELEtBQUssQ0FDUixDQUFDO0tBQ0w7Q0FDSjs7Ozs7UUN0QmUsY0FBYyxHQUFkLGNBQWM7Ozs7O0lBSHRCLE9BQU8sV0FBTyxjQUFjLEVBQTVCLE9BQU87O0lBQ1AsVUFBVSxXQUFPLGlCQUFpQixFQUFsQyxVQUFVOztBQUVYLFNBQVMsY0FBYyxDQUFDLE1BQU0sRUFBRTtBQUNuQyxRQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTTtRQUN0QixRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVE7UUFDMUIsTUFBTSxHQUFHLEFBQUMsTUFBTSxDQUFDLE1BQU0sR0FBSSxNQUFNLENBQUMsTUFBTSxHQUFHLFNBQVM7UUFDcEQsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU87UUFDM0QsSUFBSSxZQUFBLENBQUM7QUFDVCxXQUFPLENBQUMsSUFBSSxHQUFHO0FBQ1gsZ0JBQVEsRUFBUixRQUFRO0FBQ1IsWUFBSSxFQUFKLElBQUk7QUFDSixnQkFBUSxFQUFFLFVBQVU7QUFDcEIsY0FBTSxFQUFOLE1BQU07QUFDTixjQUFNLEVBQU4sTUFBTTtLQUNULENBQUMsQ0FBQztDQUNOIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7Y29uZmlnfSAgICAgICAgICAgICBmcm9tICcuL2pzL2NvbmZpZyc7XG5pbXBvcnQge2J1aWxkV0xTc2lkZX0gICAgICAgZnJvbSAnLi9qcy9idWlsZFdMU3NpZGUnO1xuaW1wb3J0IHtwYXJzZUNvbXBvbmVudH0gICAgIGZyb20gJy4vanMvcGFyc2VDb21wb25lbnQnO1xuaW1wb3J0IHtsaXN0ZW5Gb3JDbGlja3N9ICAgIGZyb20gJy4vanMvbGlzdGVuRm9yQ2xpY2tzJztcblxubGV0IGh0bWwgPSAnJyxcbiAgICBqc29uLFxuICAgIGFyZ3MsXG4gICAgaXNFcnJvciA9IGZhbHNlLFxuICAgIHdsc09yZGVyID0gY29uZmlnLndsc09yZGVyXG4gICAgO1xuXG5mdW5jdGlvbiBpbml0V0xTKCkge1xuICAgIC8vIGFkZCBiYXNlIGNvbXBvbmVudHMgYXMgZGV0ZXJtaW5lZCBieSBjb25maWcgb3JkZXJcbiAgICBPYmplY3Qua2V5cyh3bHNPcmRlcikuZm9yRWFjaChmdW5jdGlvbihrZXksIGluZGV4LCBhcnJheSkge1xuICAgICAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRlbnQnKSxcbiAgICAgICAgICAgIGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgY2hpbGQuaWQgPSB3bHNPcmRlcltrZXldO1xuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICBpZiAod2xzT3JkZXJba2V5XSA9PT0gJ3NpZGUnKSB7XG4gICAgICAgICAgICAvLyB0b2RvIG1ha2Ugc3VyZSBzaWRlIGRlZmF1bHQgY29tcCBpcyBub3QgaW4gYXJyYXkgb2YgcmVndWxhciBvcmRlclxuICAgICAgICAgICAgYnVpbGRXTFNzaWRlKGFyZ3MgPSB7Y29uZmlnfSk7XG4gICAgICAgICAgICBwYXJzZUNvbXBvbmVudChhcmdzID0ge2ZpbGVOYW1lOiBjb25maWcud2xzU2lkZS5kZWZhdWx0LCBwYXJlbnQ6ICd0aGVzaWRlJywgY29uZmlnfSk7XG4gICAgICAgICAgICBsaXN0ZW5Gb3JDbGlja3MoYXJncyA9IHtjbGFzc05hbWU6ICdzaWRlbGlua3MnLCBjb25maWd9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlQ29tcG9uZW50KGFyZ3MgPSB7ZmlsZU5hbWU6IHdsc09yZGVyW2tleV0sIGNvbmZpZ30pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmluaXRXTFMoKTtcblxuLyogdG9kb1xuc3RhcnQgbmV3IGNzcyBidWlsZFxuc2VydmljZSB3b3JrZXJcbi8vZ2V0IHJpZCBvZiAjIG9uY2xpY2tcbi8vb3BlbiBsaW5rcyBpbiBuZXcgdGFic1xuLy9zZXQgc2lkZSB0b2dnbGVcbmVuaGFuY2VtZW50czpcbmFkZCBtYXNvbnJ5IG9wdGlvbjogb25seSBsb2FkIGluIGRlc2t0b3AsIHR1cm4gb24vb2ZmLCBrZWVwIG9uIGZvciBhbGwgZGV2aWNlcywgY3NzIG1hc29ucnkgKGh0dHA6Ly93M2JpdHMuY29tL2Nzcy1tYXNvbnJ5LylcbmNvbm5lY3QgdG8gZ3NoZWV0IHRhYnNcbmxvYWQgc2lkZSB2aWEgdXJsIHBhcmFtXG4qL1xuXG4vL1xuLy8gZnVuY3Rpb24gc2V0TWFzb25yeSgpIHtcbi8vICAgICB2YXIgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50Jyk7XG4vLyAgICAgdmFyIG1zbnJ5ID0gbmV3IE1hc29ucnkoIGVsZW0sIHtcbi8vICAgICAgIGl0ZW1TZWxlY3RvcjogJ3VsJ1xuLy8gICAgIH0pO1xuLy8gfVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkSFRNTChwYXJhbXMpIHtcblxuICAgIGxldCBkYXRhID0gcGFyYW1zLmpzb24sXG4gICAgICAgIGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIGZpbGVOYW1lID0gcGFyYW1zLmZpbGVOYW1lLFxuICAgICAgICBhcmdzLFxuICAgICAgICBvdXRwdXQgPSAnJztcblxuICAgIGNvbnN0IGhkclByZSA9IGNvbmZpZy5odG1sLmhlYWRlci5wcmVmaXgsXG4gICAgICAgICAgaGRyU3VmID0gY29uZmlnLmh0bWwuaGVhZGVyLnN1ZmZpeCxcbiAgICAgICAgICBzdWJIZHJQcmUgPSBjb25maWcuaHRtbC5zdWJoZWQucHJlZml4LFxuICAgICAgICAgIHN1YkhkclN1ZiA9IGNvbmZpZy5odG1sLnN1YmhlZC5zdWZmaXgsXG4gICAgICAgICAgcHJlID0gY29uZmlnLmh0bWwub3V0cHV0LnByZWZpeCxcbiAgICAgICAgICBzdWYgPSBjb25maWcuaHRtbC5vdXRwdXQuc3VmZml4O1xuXG4gICAgLy8gY29tcG9uZW50IGhlYWRlclxuICAgIG91dHB1dCArPSBoZHJQcmUgKyBmaWxlTmFtZSArIGhkclN1ZjtcblxuICAgIGlmIChkYXRhLm9wdGlvbnMpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoZGF0YS5vcHRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaW5kZXgpIHtcbiAgICAgICAgICAgIG91dHB1dCArPSBwcmUgKyAnPGEgY2xhc3M9XCJzaWRlbGlua3NcIiB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiXCI+JyArIGRhdGEub3B0aW9uc1trZXldICsgJzwvYT4nICsgc3VmO1xuICAgICAgICAgICAgb3V0cHV0ICs9ICdcXG4nO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5saW5rcykge1xuICAgICAgICBPYmplY3Qua2V5cyhkYXRhLmxpbmtzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLmxpbmtzW2tleV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEubGlua3Nba2V5XSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc3ViIGhlYWRlcnNcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9IHN1YkhkclByZSArIGtleSArIHN1YkhkclN1ZiArICdcXG4nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlZ3VsYXIgbGlzdCBpdGVtXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSBwcmUgKyAnPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicgKyBkYXRhLmxpbmtzW2tleV0gKyAnXCI+JyArIGtleSArICc8L2E+JyArIHN1ZjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9ICdcXG4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLmxpbmtzW2tleV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IHByZTtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhkYXRhLmxpbmtzW2tleV0pLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlyc3Qgb2YgbWFueSBpdGVtcyBvbiBhIHNpbmdsZSByb3dcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dCArPSAnPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIicgKyBkYXRhLmxpbmtzW2tleV1baXRlbV0gKyAnXCI+JyArIGl0ZW0gKyAnPC9hPic7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgcmVzdCBvZiBtYW55IGl0ZW1zIG9uIGEgc2luZ2xlIHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ICs9ICcgLSA8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJyArIGRhdGEubGlua3Nba2V5XVtpdGVtXSArICdcIj4nICsgaXRlbS5zdWJzdHJpbmcoMCwgMSkgKyAnPC9hPic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gJ1xcbic7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IHN1ZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxuXG59XG4iLCJpbXBvcnQge2luc2VydEhUTUx9IGZyb20gJy4vaW5zZXJ0SFRNTC5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFdMU3NpZGUocGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIG9wdGlvbnMgPSBjb25maWcud2xzU2lkZSxcbiAgICAgICAgYXJncyxcbiAgICAgICAgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RoZXNpZGUnKSxcbiAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICBjaGlsZC5pZCA9IGNvbmZpZy53bHNTaWRlLmRlZmF1bHQ7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICBpbnNlcnRIVE1MKGFyZ3MgPSB7b3B0aW9ucywgY29uZmlnfSk7XG59XG4iLCJleHBvcnQgbGV0IGNvbmZpZyA9IHtcbiAgICBodG1sOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgcHJlZml4OiAnPGxpPicsXG4gICAgICAgICAgICBzdWZmaXg6ICc8L2xpPidcbiAgICAgICAgfSxcbiAgICAgICAgaGVhZGVyOiB7XG4gICAgICAgICAgICBwcmVmaXg6ICc8aDI+JyxcbiAgICAgICAgICAgIHN1ZmZpeDogJzwvaDI+J1xuICAgICAgICB9LFxuICAgICAgICBzdWJoZWQ6IHtcbiAgICAgICAgICAgIHByZWZpeDogJzxoMz4nLFxuICAgICAgICAgICAgc3VmZml4OiAnPC9oMz4nXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHdsc09yZGVyOiBbXG4gICAgICAgICdob2NrZXknLFxuICAgICAgICAnYmFzZWJhbGwnLFxuICAgICAgICAnZm9vdGJhbGwnLFxuICAgICAgICAnZ29vZ2xlJyxcbiAgICAgICAgJ2RpZ2l0YWwnLFxuICAgICAgICAnc3RyZWFtJyxcbiAgICAgICAgJ290aGVyJyxcbiAgICAgICAgJ3NpZGUnXG4gICAgXSxcbiAgICB3bHNTaWRlOiB7XG4gICAgICAgIGZpbGVOYW1lOiAnc2lkZScsXG4gICAgICAgIGRlZmF1bHQ6ICdicCcsXG4gICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICAgICdicCcsXG4gICAgICAgICAgICAndG5yJyxcbiAgICAgICAgICAgICdkZXYyJyxcbiAgICAgICAgICAgICdqcycsXG4gICAgICAgICAgICAnd3AnLFxuICAgICAgICAgICAgJ21sYicsXG4gICAgICAgICAgICAnbWF0Y2h1cCdcbiAgICAgICAgIF1cbiAgICB9LFxuICAgIGRhdGE6IHtcbiAgICAgICAgYmFzZURpcjogJy4vZGF0YS8nLFxuICAgICAgICBmaWxlRXh0OiAnLmpzb24nXG4gICAgfSBcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0SlNPTihwYXJhbXMpIHtcbiAgICBsZXQgY2FsbGJhY2sgPSBwYXJhbXMuY2FsbGJhY2ssXG4gICAgICAgIGFyZ3M7XG4gICAgZmV0Y2gocGFyYW1zLmZpbGUpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHsgXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgfSkudGhlbihmdW5jdGlvbihqc29uKSB7XG4gICAgICAgIGFyZ3MgPSBwYXJhbXM7XG4gICAgICAgIGFyZ3MuanNvbiA9IGpzb247XG4gICAgICAgIGNhbGxiYWNrKGFyZ3MpO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHtidWlsZEhUTUx9IGZyb20gJy4vYnVpbGRIVE1MLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluc2VydEhUTUwocGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IHBhcmFtcy5jb25maWcsXG4gICAgICAgIGpzb24sXG4gICAgICAgIGZpbGVOYW1lLFxuICAgICAgICBlbGVtZW50LFxuICAgICAgICBodG1sLFxuICAgICAgICBhcmdzID0ge307XG4gICAgaWYgKHBhcmFtcy5qc29uKSB7XG4gICAgICAgIGpzb24gPSBwYXJhbXMuanNvbixcbiAgICAgICAgZmlsZU5hbWUgPSBwYXJhbXMuZmlsZU5hbWU7XG4gICAgfVxuICAgIGlmIChwYXJhbXMub3B0aW9ucykge1xuICAgICAgICBqc29uID0gcGFyYW1zLm9wdGlvbnMsXG4gICAgICAgIGZpbGVOYW1lID0gJ3NpZGUnO1xuICAgIH1cbiAgICBodG1sID0gYnVpbGRIVE1MKGFyZ3MgPSB7anNvbiwgY29uZmlnLCBmaWxlTmFtZX0pO1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmaWxlTmFtZSk7XG4vLyAgICBjb25zb2xlLmxvZyhmaWxlTmFtZSwgZWxlbWVudCk7XG4gICAgZWxlbWVudC5pbm5lckhUTUwgPSBodG1sO1xufVxuIiwiaW1wb3J0IHtnZXRKU09OfSBmcm9tICcuL2dldEpTT04uanMnO1xuaW1wb3J0IHtpbnNlcnRIVE1MfSBmcm9tICcuL2luc2VydEhUTUwuanMnO1xuaW1wb3J0IHtwYXJzZUNvbXBvbmVudH0gZnJvbSAnLi9wYXJzZUNvbXBvbmVudC5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXN0ZW5Gb3JDbGlja3MocGFyYW1zKSB7XG4gICAgbGV0IGNsYXNzTmFtZSA9IHBhcmFtcy5jbGFzc05hbWUsXG4gICAgICAgIGxpbmtzVG9DbGljayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKSxcbiAgICAgICAgY29uZmlnID0gcGFyYW1zLmNvbmZpZyxcbiAgICAgICAgYXJncztcbiAgICBmb3IgKHZhciBpPTA7IGk8bGlua3NUb0NsaWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxpbmtzVG9DbGlja1tpXS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgJ2NsaWNrJywgXG4gICAgICAgICAgICBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGV0IHRoaXNGaWxlTmFtZSA9IHRoaXMudGV4dENvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aGVzaWRlJyksXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgY2hpbGQuaWQgPSB0aGlzRmlsZU5hbWU7XG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgICAgICAgICBwYXJzZUNvbXBvbmVudChhcmdzID0ge2ZpbGVOYW1lOiB0aGlzRmlsZU5hbWUsIHBhcmVudDogJ3RoZXNpZGUnLCBjb25maWcsIGdldEpTT04sIGluc2VydEhUTUx9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCB7Z2V0SlNPTn0gZnJvbSAnLi9nZXRKU09OLmpzJztcbmltcG9ydCB7aW5zZXJ0SFRNTH0gZnJvbSAnLi9pbnNlcnRIVE1MLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQ29tcG9uZW50KHBhcmFtcykge1xuICAgIGxldCBjb25maWcgPSBwYXJhbXMuY29uZmlnLFxuICAgICAgICBmaWxlTmFtZSA9IHBhcmFtcy5maWxlTmFtZSxcbiAgICAgICAgcGFyZW50ID0gKHBhcmFtcy5wYXJlbnQpID8gcGFyYW1zLnBhcmVudCA6ICdjb250ZW50JyxcbiAgICAgICAgZmlsZSA9IGNvbmZpZy5kYXRhLmJhc2VEaXIgKyBmaWxlTmFtZSArIGNvbmZpZy5kYXRhLmZpbGVFeHQsXG4gICAgICAgIGFyZ3M7XG4gICAgZ2V0SlNPTihhcmdzID0ge1xuICAgICAgICBmaWxlTmFtZSwgXG4gICAgICAgIGZpbGUsIFxuICAgICAgICBjYWxsYmFjazogaW5zZXJ0SFRNTCxcbiAgICAgICAgcGFyZW50LCBcbiAgICAgICAgY29uZmlnXG4gICAgfSk7XG59XG4iXX0=
