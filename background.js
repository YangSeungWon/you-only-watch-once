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
    chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: blockThumbnail,
    });
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
                }
            });
        }
    }
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

function blockThumbnail() {
    const thumbnailList = document.getElementsByClassName('ytd-thumbnail');
    chrome.storage.sync.get('watchedVideos', (data) => {
        const watchedVideos = data.watchedVideos || [];
        for (let thumbnail of thumbnailList) {
            if (thumbnail.href === undefined || thumbnail.href === '') { continue; }
            const videoId = thumbnail.href.split('v=')[1].split('&')[0];
            if (videoId && watchedVideos.includes(videoId)) {
                thumbnail.style.filter = 'blur(50px)';
            }
        }
    });
}
