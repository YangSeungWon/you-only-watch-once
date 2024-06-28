// refresh and click
chrome.webNavigation.onCommitted.addListener((details) => {
    handleNavigation(details);
    console.log("onCommitted");
});

// back and forward navigation
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    handleNavigation(details);
    console.log("onHistoryStateUpdated");
});

function handleNavigation(details) {
    if (details.url.includes("youtube.com/watch")) {
        const videoId = new URL(details.url).searchParams.get('v');
        if (videoId) {
            chrome.storage.sync.get('watchedVideos', (data) => {
                const watchedVideos = data.watchedVideos || [];
                if (watchedVideos.includes(videoId)) {
                    chrome.scripting.executeScript({
                        target: { tabId: details.tabId },
                        func: blockVideo,
                    });
                } else {
                    chrome.scripting.executeScript({
                        target: { tabId: details.tabId },
                        func: unblockVideo,
                    });
                    chrome.storage.sync.set({ watchedVideos: [...watchedVideos, videoId] });
                    blockThumbnail(videoId);
                }
            });
        }
    }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('watchedVideos', (data) => {
        const watchedVideos = data.watchedVideos || [];
        for (let videoId of watchedVideos) {
            blockThumbnail(videoId);
        }
    });
});

function blockThumbnail(videoId) {
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
        const count = rules.length;
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [
                {
                    id: count,
                    priority: 1,
                    action: {
                        type: 'block'
                    },
                    condition: {
                        urlFilter: '*://i.ytimg.com/vi/' + videoId + '/*',
                        resourceTypes: ['image']
                    }
                }
            ], removeRuleIds: [count]
        });
    });
}

function blockVideo() {
    const videoContainer = document.querySelector('.html5-video-player');
    if (videoContainer) {
        // videoContainer.style.display = 'none';
        videoContainer.style.filter = 'blur(50px)';
    }
}

function unblockVideo() {
    const videoContainer = document.querySelector('.html5-video-player');
    if (videoContainer) {
        // videoContainer.style.display = 'block';
        videoContainer.style.filter = 'none';
    }
}
