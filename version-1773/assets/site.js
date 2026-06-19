(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!button || !panel) return;
    button.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    if (!slides.length) return;
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        restart();
      });
    });

    show(0);
    restart();
  }

  function initSearch() {
    var input = document.querySelector('[data-filter-input]');
    if (!input) return;
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-filter-item]'));
    var empty = document.querySelector('[data-filter-empty]');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      var visible = 0;
      items.forEach(function (item) {
        var text = (item.getAttribute('data-filter-text') || item.textContent || '').toLowerCase();
        var match = !q || text.indexOf(q) !== -1;
        item.style.display = match ? '' : 'none';
        if (match) visible += 1;
      });
      if (empty) empty.style.display = visible ? 'none' : 'block';
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initSearch();
  });
})();

function initVideoPlayer(playUrl) {
  var video = document.querySelector('[data-player-video]');
  var overlay = document.querySelector('[data-player-overlay]');
  if (!video || !overlay || !playUrl) return;
  var started = false;
  var hls = null;

  function begin() {
    if (started) {
      video.play().catch(function () {});
      return;
    }
    started = true;
    overlay.classList.add('hidden');
    video.controls = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = playUrl;
      video.play().catch(function () {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(playUrl);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      return;
    }

    video.src = playUrl;
    video.play().catch(function () {});
  }

  overlay.addEventListener('click', begin);
  video.addEventListener('click', function () {
    if (!started) begin();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === ' ' && document.activeElement === document.body) {
      event.preventDefault();
      begin();
    }
  });
}
