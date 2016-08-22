import {getJSON} from './getJSON.js';
import {insertHTML} from './insertHTML.js';

export function parseComponent(params) {
    let config = params.config,
        fileName = params.fileName,
        parent = (params.parent) ? params.parent : 'content',
        file = config.data.baseDir + fileName + config.data.fileExt,
        args;
    getJSON(args = {
        fileName, 
        file, 
        callback: insertHTML,
        parent, 
        config
    });
}
