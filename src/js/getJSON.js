export function getJSON(params) {
    let callback = params.callback,
        args;
    fetch(params.file).then(function(response) { 
        return response.json();
    }).then(function(json) {
        params.json = json;
        callback(args = params);
    });
}
