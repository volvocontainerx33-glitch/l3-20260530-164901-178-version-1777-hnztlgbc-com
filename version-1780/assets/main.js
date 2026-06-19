document.addEventListener('DOMContentLoaded', function() {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function() {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function(dot, dotIndex) {
            dot.addEventListener('click', function() {
                showSlide(dotIndex);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function() {
                showSlide(current + 1);
            }, 5200);
        }
    }

    document.querySelectorAll('[data-filter-panel]').forEach(function(panel) {
        var scope = panel.closest('.content-section') || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
        var searchInput = panel.querySelector('[data-search-input]');
        var regionSelect = panel.querySelector('[data-filter-region]');
        var typeSelect = panel.querySelector('[data-filter-type]');
        var yearSelect = panel.querySelector('[data-filter-year]');

        function fillSelect(select, key) {
            if (!select) {
                return;
            }
            var values = cards.map(function(card) {
                return card.getAttribute(key) || '';
            }).filter(Boolean).filter(function(value, index, array) {
                return array.indexOf(value) === index;
            }).sort(function(a, b) {
                return String(b).localeCompare(String(a), 'zh-CN');
            });
            values.forEach(function(value) {
                var option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        fillSelect(regionSelect, 'data-region');
        fillSelect(typeSelect, 'data-type');
        fillSelect(yearSelect, 'data-year');

        function applyFilter() {
            var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var region = regionSelect ? regionSelect.value : '';
            var type = typeSelect ? typeSelect.value : '';
            var year = yearSelect ? yearSelect.value : '';

            cards.forEach(function(card) {
                var text = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-type') || '',
                    card.getAttribute('data-year') || '',
                    card.getAttribute('data-tags') || ''
                ].join(' ').toLowerCase();
                var matched = true;
                if (query && text.indexOf(query) === -1) {
                    matched = false;
                }
                if (region && card.getAttribute('data-region') !== region) {
                    matched = false;
                }
                if (type && card.getAttribute('data-type') !== type) {
                    matched = false;
                }
                if (year && card.getAttribute('data-year') !== year) {
                    matched = false;
                }
                card.hidden = !matched;
            });
        }

        [searchInput, regionSelect, typeSelect, yearSelect].forEach(function(control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });
    });
});
