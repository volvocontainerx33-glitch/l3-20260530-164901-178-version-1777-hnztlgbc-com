(function () {
  var video = document.getElementById('movie-player');
  var startButton = document.querySelector('[data-player-start]');

  if (!video || !startButton) {
    return;
  }

  var source = video.getAttribute('data-src');
  var hlsInstance = null;
  var initialized = false;

  function hideStartButton() {
    startButton.classList.add('is-hidden');
  }

  function initializePlayer() {
    if (!source) {
      return Promise.reject(new Error('Missing m3u8 source'));
    }

    if (initialized) {
      return video.play();
    }

    initialized = true;

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);

      return new Promise(function (resolve) {
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          resolve(video.play());
        });
      });
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return video.play();
    }

    video.src = source;
    return video.play();
  }

  startButton.addEventListener('click', function () {
    initializePlayer()
      .then(hideStartButton)
      .catch(function () {
        hideStartButton();
        video.setAttribute('controls', 'controls');
      });
  });

  video.addEventListener('play', hideStartButton);

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
