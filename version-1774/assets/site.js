(function () {
  "use strict";

  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initHero() {
    var carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) {
      return;
    }

    var slides = selectAll("[data-hero-slide]", carousel);
    var dots = selectAll("[data-hero-dot]", carousel);
    var thumbs = selectAll("[data-hero-thumb]", carousel);
    var prev = carousel.querySelector("[data-hero-prev]");
    var next = carousel.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle("is-active", itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle("is-active", itemIndex === index);
      });
      thumbs.forEach(function (thumb, itemIndex) {
        thumb.classList.toggle("is-active", itemIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, itemIndex) {
      dot.addEventListener("click", function () {
        show(itemIndex);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function initFilters() {
    var list = document.querySelector("[data-filter-list]");
    if (!list) {
      return;
    }

    var input = document.querySelector("[data-filter-input]");
    var sort = document.querySelector("[data-sort-select]");
    var channel = document.querySelector("[data-channel-filter]");
    var count = document.querySelector("[data-filter-count]");
    var cards = selectAll(".movie-card", list);

    function apply() {
      var query = normalize(input ? input.value : "");
      var channelValue = channel ? channel.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-genre"),
          card.textContent
        ].join(" "));
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var matchesChannel = !channelValue || card.getAttribute("data-channel") === channelValue;
        var isVisible = matchesQuery && matchesChannel;
        card.classList.toggle("is-hidden-by-filter", !isVisible);
        if (isVisible) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = visible + " 个结果";
      }
    }

    function sortCards() {
      var mode = sort ? sort.value : "year";
      var sorted = cards.slice().sort(function (a, b) {
        if (mode === "hot") {
          return Number(b.getAttribute("data-views")) - Number(a.getAttribute("data-views"));
        }
        if (mode === "title") {
          return normalize(a.getAttribute("data-title")).localeCompare(normalize(b.getAttribute("data-title")), "zh-CN");
        }
        return Number(b.getAttribute("data-year")) - Number(a.getAttribute("data-year"));
      });
      sorted.forEach(function (card) {
        list.appendChild(card);
      });
      cards = sorted;
      apply();
    }

    if (input) {
      input.addEventListener("input", apply);
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q");
      if (query) {
        input.value = query;
      }
    }

    if (sort) {
      sort.addEventListener("change", sortCards);
    }

    if (channel) {
      channel.addEventListener("change", apply);
    }

    sortCards();
  }

  function initPlayers() {
    selectAll("[data-player]").forEach(function (shell) {
      var button = shell.querySelector("[data-play-button]");
      var video = shell.querySelector("video");
      var status = shell.querySelector("[data-player-status]");
      var source = shell.getAttribute("data-hls-src");
      var hls = null;
      var loaded = false;

      if (!button || !video || !source) {
        return;
      }

      function setStatus(message) {
        if (status) {
          status.textContent = message;
        }
      }

      function attachSource() {
        if (loaded) {
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          loaded = true;
          setStatus("正在加载播放源");
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          loaded = true;
          setStatus("正在初始化播放器");
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setStatus("可以播放");
            video.play().catch(function () {
              setStatus("点击播放器继续播放");
            });
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setStatus("播放源加载失败，请稍后重试");
              if (hls) {
                hls.destroy();
                hls = null;
              }
              loaded = false;
            }
          });
          return;
        }

        video.src = source;
        loaded = true;
        setStatus("当前浏览器尝试直接播放");
      }

      button.addEventListener("click", function () {
        attachSource();
        video.controls = true;
        button.classList.add("is-hidden");
        video.play().catch(function () {
          setStatus("点击播放器继续播放");
        });
      });

      video.addEventListener("playing", function () {
        button.classList.add("is-hidden");
        setStatus("正在播放");
      });

      video.addEventListener("pause", function () {
        if (!video.ended) {
          setStatus("已暂停");
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHero();
    initFilters();
    initPlayers();
  });
})();
