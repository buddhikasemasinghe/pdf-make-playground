var templateReady = false;

function showTemplateFn(nextFn, divId, data) {
    if (!templateReady) {
        setTimeout(function () {
            showTemplateFn(nextFn, divId, data);
        }, 500);
        return
    }
    if(divId !== null && divId !== 'undefined' && data !== null && data !== 'undefined') {
        nextFn(divId, data);
        return;
    }
    if (divId !== null && divId !== 'undefined' && (data === null || data === 'undefined')) {
        nextFn(divId);
        return;
    }
    nextFn();
}

function setTemplateReadyFn() {
    templateReady = true;
}