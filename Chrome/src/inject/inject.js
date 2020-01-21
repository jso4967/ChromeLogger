chrome.browserAction.onClicked.addListener(
    function(tab) {
        chrome.tabs.create({url: "chrome-extension://nkbkefcoendpipfdidjbgiefigmccpep/src/options/index.html"})
    }
);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.executeScript(tabId, {
            allFrames: true, 
            file: 'src/inject/payload.js'
        }, ()=>chrome.runtime.lastError);
    }``
});