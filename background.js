/*
	Github: https://github.com/frosmoon
	File: background.js
*/
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        let urls = request.urls;
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            setTimeout(() => {
                chrome.tabs.create({ url: url });
            }, i * 1000);
        }
        sendResponse("ok");
        return true;
    });
