// Function to update the watched videos list and count
function updateWatchedVideos() {
    chrome.storage.sync.get('watchedVideos', (data) => {
      const watchedVideos = data.watchedVideos || [];
      const videoCountElement = document.getElementById('videoCount');
      const videoListElement = document.getElementById('videoList');
  
      // Update the count
      videoCountElement.textContent = watchedVideos.length;
  
      // Clear the current list
      videoListElement.innerHTML = '';
  
      // Populate the list with watched video IDs
      watchedVideos.forEach((videoId) => {
        const listItem = document.createElement('li');
        listItem.textContent = videoId;
        videoListElement.appendChild(listItem);
      });
    });
  }
  
  // Event listener for clearing the watched videos list
  document.getElementById('clearWatched').addEventListener('click', () => {
    chrome.storage.sync.set({ watchedVideos: [] }, () => {
      alert('Watched videos list cleared.');
      updateWatchedVideos();
    });
  });
  
  // Initial update of the watched videos list and count
  updateWatchedVideos();
  