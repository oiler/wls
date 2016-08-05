export function parseComponent(params) {
    let config = params.config,
        fileName = params.fileName,
        parent = (params.parent) ? params.parent : 'content',
        file = config.data.baseDir + fileName + config.data.fileExt,
        getJSON = params.getJSON,
        insertHTML = params.insertHTML,
        args;
    getJSON(args = {
        fileName, 
        file, 
        callback: insertHTML,
        parent, 
        config
    });
}
