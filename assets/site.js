(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var filterPanel = document.querySelector('[data-filter-panel]');

  if (filterPanel) {
    var keyword = filterPanel.querySelector('[data-filter-keyword]');
    var region = filterPanel.querySelector('[data-filter-region]');
    var type = filterPanel.querySelector('[data-filter-type]');
    var reset = filterPanel.querySelector('[data-filter-reset]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-grid] .movie-card'));

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilter() {
      var q = normalize(keyword && keyword.value);
      var selectedRegion = normalize(region && region.value);
      var selectedType = normalize(type && type.value);

      cards.forEach(function (card) {
        var text = normalize([
          card.dataset.title,
          card.dataset.year,
          card.dataset.region,
          card.dataset.type,
          card.dataset.genre,
          card.innerText
        ].join(' '));
        var regionMatch = !selectedRegion || normalize(card.dataset.region) === selectedRegion;
        var typeMatch = !selectedType || normalize(card.dataset.type) === selectedType;
        var keywordMatch = !q || text.indexOf(q) !== -1;

        card.style.display = regionMatch && typeMatch && keywordMatch ? '' : 'none';
      });
    }

    [keyword, region, type].forEach(function (input) {
      if (input) {
        input.addEventListener('input', applyFilter);
        input.addEventListener('change', applyFilter);
      }
    });

    if (reset) {
      reset.addEventListener('click', function () {
        if (keyword) {
          keyword.value = '';
        }
        if (region) {
          region.value = '';
        }
        if (type) {
          type.value = '';
        }
        applyFilter();
      });
    }
  }
})();
