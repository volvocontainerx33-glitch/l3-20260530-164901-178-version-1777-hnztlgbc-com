(function () {
    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function $all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initMobileMenu() {
        var button = $('[data-mobile-toggle]');
        var menu = $('[data-mobile-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function initHero() {
        var hero = $('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = $all('[data-hero-slide]', hero);
        var dots = $all('[data-hero-dot]', hero);
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
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

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function initFilters() {
        $all('[data-filter-scope]').forEach(function (scope) {
            var input = $('[data-filter-input]', scope);
            var region = $('[data-filter-region]', scope);
            var type = $('[data-filter-type]', scope);
            var category = $('[data-filter-category]', scope);
            var cards = $all('[data-card]', scope);
            var empty = $('[data-empty-state]', scope);

            function valueOf(node) {
                return node ? String(node.value || '').trim().toLowerCase() : '';
            }

            function update() {
                var keyword = valueOf(input);
                var selectedRegion = valueOf(region);
                var selectedType = valueOf(type);
                var selectedCategory = valueOf(category);
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute('data-title'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-type'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-genre'),
                        card.getAttribute('data-tags')
                    ].join(' ').toLowerCase();
                    var ok = true;
                    if (keyword && haystack.indexOf(keyword) === -1) {
                        ok = false;
                    }
                    if (selectedRegion && String(card.getAttribute('data-region') || '').toLowerCase() !== selectedRegion) {
                        ok = false;
                    }
                    if (selectedType && String(card.getAttribute('data-type') || '').toLowerCase().indexOf(selectedType) === -1) {
                        ok = false;
                    }
                    if (selectedCategory && String(card.getAttribute('data-category') || '').toLowerCase() !== selectedCategory) {
                        ok = false;
                    }
                    card.classList.toggle('hidden-by-filter', !ok);
                    if (ok) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }

            [input, region, type, category].forEach(function (node) {
                if (node) {
                    node.addEventListener('input', update);
                    node.addEventListener('change', update);
                }
            });
        });
    }

    window.initMoviePlayer = function (src) {
        var video = document.getElementById('moviePlayer');
        var startButton = document.getElementById('playerStart');
        if (!video || !src) {
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(src);
            hls.attachMedia(video);
        } else {
            video.src = src;
        }

        function startPlayback() {
            if (startButton) {
                startButton.classList.add('is-hidden');
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    if (startButton) {
                        startButton.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (startButton) {
            startButton.addEventListener('click', startPlayback);
        }

        video.addEventListener('play', function () {
            if (startButton) {
                startButton.classList.add('is-hidden');
            }
        });

        video.addEventListener('pause', function () {
            if (video.currentTime === 0 && startButton) {
                startButton.classList.remove('is-hidden');
            }
        });
    };

    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initHero();
        initFilters();
    });
})();
