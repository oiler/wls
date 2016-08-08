export function listenForClicks(params) {
    let className = params.className,
        parseComponent = params.parseComponent,
        linksToClick = document.getElementsByClassName(className),
        config = params.config,
        getJSON = params.getJSON,
        insertHTML = params.insertHTML,
        args;
    for (var i=0; i<linksToClick.length; i++) {
        linksToClick[i].addEventListener(
            'click', 
            function(ev) {
                ev.preventDefault();
                let thisFileName = this.textContent,
                    parent = document.getElementById('theside'),
                    child = document.createElement('ul');
                parent.innerHTML = '';
                child.id = thisFileName;
                parent.appendChild(child);
                parseComponent(args = {fileName: thisFileName, parent: 'theside', config, getJSON, insertHTML});
            },
            false
        );
    }
}
