/**
 * TODO: CSS Variables
 */
var element = $0;
var matchedRules = window.getMatchedCSSRules(element);
var iframe = getComponentIframe(element, document.body);

async function getComponentIframe(element, container){
    const { html, css } = getComponent(element);

    const iframeConfigDefaults = {
        width:           '100%',
        height:          '1000px',
        frameborder:     '0',
        allowfullscreen: '' ,
        allow:           'autoplay'
    };
    const iframeStyleConfig = {
        'min-width': '100%',
        'min-height': '',
        'opacity': 0,
        'display': 'block'
    };

    const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <title>Component</title>
                <style>${css}</style>
            </head>
            <body>             
                ${html}
            </body>
        </html>
    `;
    const iframe = document.createElement('iframe');
    container.appendChild( iframe );

    const iframeConfigFinal = Object.assign({}, iframeConfigDefaults);

    container.appendChild(iframe);

    iframe.contentDocument.open();
    iframe.contentDocument.write(htmlTemplate);
    const contentLoadedPromise = new Promise(res => {
        iframe.contentDocument.addEventListener('DOMContentLoaded', res);
    });
    iframe.contentDocument.close();

    await contentLoadedPromise;

    iframe.style.opacity = '1';

    return iframe;

}

function getComponent(element){
    const css = getCssText( element );
    const html = element.outerHTML;

    return {
        css,
        html
    }
}

function getCssText(element){
    const styleInfos = getStyleInfoRecursive(element);
    const cssText = styleInfos.map( styleInfo => styleInfo.cssTexts.join('\n') ).join('\n');

    return cssText;
}

var elementStyleInfo = getStyleInfoRecursive(element);

function getStyleInfoRecursive( element ){
    const styleInfos = [];

    recursion( element, styleInfos );

    return styleInfos;

    function recursion( element, styleInfos ){
        if(!element.children) return;

        const childrenAsArray = [ ...element.children ];
        const styleInfo = getStyleInfo( element );

        styleInfos.push( styleInfo );

        childrenAsArray.forEach( child => recursion( child, styleInfos ) );
    }

}

function getStyleInfo( element ){
    const elementId = element.id;
    const elementClassList = element.classList;

    const foundRules = getMatchedCSSRules(element);
    const foundCssTexts         = foundRules.map( rule => rule.cssText );

    return {
        id: elementId,
        rules: foundRules,
        cssTexts: foundCssTexts,
        classList: elementClassList
    };
}
