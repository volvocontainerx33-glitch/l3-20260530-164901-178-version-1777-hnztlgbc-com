(function () {
  function initMoviePlayer(options) {
    var root = document.querySelector(options.selector);
    if (!root) {
      return;
    }
    var video = root.querySelector('video');
    var overlay = root.querySelector('.player-overlay');
    var source = options.source;
    var started = false;
    var hls = null;

    function start() {
      if (!video || !source) {
        return;
      }
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      if (!started) {
        started = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          video.load();
          video.play().catch(function () {});
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.src = source;
          video.load();
          video.play().catch(function () {});
        }
      } else {
        video.play().catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }
    root.addEventListener('click', function (event) {
      if (event.target === video && video.paused) {
        start();
      }
    });
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
