export function buildWLSside(params) {
    let config = params.config,
        insertHTML = params.insertHTML,
        options = config.wlsSide,
        args;
    insertHTML(args = {options, config});
}
