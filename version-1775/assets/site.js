(function () {
    function selectAll(selector, parent) {
        return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
    }

    function initMobileMenu() {
        var toggle = document.querySelector('.mobile-toggle');
        var menu = document.getElementById('mobileMenu');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            var open = menu.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    function initHeaderSearch() {
        selectAll('.site-search-form').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                var input = form.querySelector('input[name="q"]');
                if (!input) {
                    return;
                }
                var query = input.value.trim();
                if (!query) {
                    event.preventDefault();
                    input.focus();
                }
            });
        });
    }

    function initHero() {
        var carousel = document.querySelector('[data-hero-carousel]');
        if (!carousel) {
            return;
        }
        var slides = selectAll('[data-hero-slide]', carousel);
        var dots = selectAll('[data-hero-dot]', carousel);
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                start();
            });
        });
        if (slides.length > 1) {
            start();
        }
    }

    function initCardFilters() {
        var filter = document.querySelector('[data-page-filter]');
        var grid = document.querySelector('[data-card-grid]');
        if (!filter || !grid) {
            return;
        }
        var cards = selectAll('[data-movie-card]', grid);
        filter.addEventListener('input', function () {
            var keyword = filter.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var text = [card.dataset.title, card.dataset.region, card.dataset.year, card.dataset.genre].join(' ').toLowerCase();
                card.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
            });
        });
    }

    function initSorting() {
        var select = document.querySelector('[data-sort-cards]');
        var grid = document.querySelector('[data-card-grid]');
        if (!select || !grid) {
            return;
        }
        select.addEventListener('change', function () {
            var cards = selectAll('[data-movie-card]', grid);
            var key = select.value;
            cards.sort(function (a, b) {
                if (key === 'year') {
                    return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                }
                if (key === 'likes') {
                    return Number(b.dataset.likes || 0) - Number(a.dataset.likes || 0);
                }
                return Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
            });
            cards.forEach(function (card) {
                grid.appendChild(card);
            });
        });
    }

    function initSearchPage() {
        var input = document.getElementById('searchPageInput');
        var grid = document.querySelector('[data-search-grid]');
        var status = document.getElementById('searchStatus');
        if (!input || !grid) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        input.value = initial;
        var cards = selectAll('[data-movie-card]', grid);

        function run() {
            var keyword = input.value.trim().toLowerCase();
            var visible = 0;
            cards.forEach(function (card) {
                var text = [card.dataset.title, card.dataset.region, card.dataset.year, card.dataset.genre].join(' ').toLowerCase();
                var matched = !keyword || text.indexOf(keyword) !== -1;
                card.classList.toggle('is-hidden', !matched);
                if (matched) {
                    visible += 1;
                }
            });
            if (status) {
                status.textContent = keyword ? '搜索结果：' + input.value.trim() : '相关片单';
            }
        }

        input.addEventListener('input', run);
        run();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initHeaderSearch();
        initHero();
        initCardFilters();
        initSorting();
        initSearchPage();
    });
}());
