import { H as Hls } from "./hls-vendor.js";

export function startPlayer(config) {
    var video = document.querySelector(config.video);
    var trigger = document.querySelector(config.trigger);
    var layer = document.querySelector(config.layer);
    var prepared = false;
    var hls = null;

    if (!video || !trigger || !config.source) {
        return;
    }

    function bindSource() {
        if (prepared) {
            return;
        }
        prepared = true;
        video.controls = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = config.source;
        } else if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(config.source);
            hls.attachMedia(video);
        } else {
            video.src = config.source;
        }
    }

    function play() {
        bindSource();
        if (layer) {
            layer.classList.add('is-hidden');
        }
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(function () {
                if (layer) {
                    layer.classList.remove('is-hidden');
                }
            });
        }
    }

    trigger.addEventListener('click', function (event) {
        event.preventDefault();
        play();
    });

    video.addEventListener('click', function () {
        if (!prepared || video.paused) {
            play();
        } else {
            video.pause();
        }
    });

    window.addEventListener('pagehide', function () {
        if (hls && typeof hls.destroy === 'function') {
            hls.destroy();
        }
    });
}
