export function getJSON(params) {
    let callback = params.callback,
        args;
    fetch(params.file).then(function(response) { 
        return response.json();
    }).then(function(json) {
        args = params;
        args.json = json;
        callback(args);
    });
}
