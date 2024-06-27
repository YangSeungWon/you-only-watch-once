chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'blockVideo') {
        blockVideo();
    } else if (request.action === 'unblockVideo') {
        unblockVideo();
    }
});
