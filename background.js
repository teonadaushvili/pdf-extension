chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
        url: "viewer.html"
    });
});