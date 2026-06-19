(function () {
  var mobileButton = document.querySelector('[data-mobile-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');
  if (mobileButton && mobilePanel) {
    mobileButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  function html(text) {
    return String(text || '').replace(/[&<>"']/g, function (match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[match];
    });
  }

  var searchInputs = document.querySelectorAll('.global-search-input');
  var searchPanel = document.querySelector('[data-search-results]');
  var movies = window.SEARCH_MOVIES || [];

  function renderSearch(value) {
    if (!searchPanel) {
      return;
    }
    var query = String(value || '').trim().toLowerCase();
    if (!query) {
      searchPanel.classList.remove('is-open');
      searchPanel.innerHTML = '';
      return;
    }
    var results = movies.filter(function (movie) {
      var haystack = [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.text].join(' ').toLowerCase();
      return haystack.indexOf(query) !== -1;
    }).slice(0, 10);

    if (!results.length) {
      searchPanel.innerHTML = '<div class="search-result"><span></span><span>没有找到匹配影片</span></div>';
      searchPanel.classList.add('is-open');
      return;
    }

    searchPanel.innerHTML = results.map(function (movie) {
      return '<a class="search-result" href="' + html(movie.url) + '">' +
        '<img src="' + html(movie.image) + '" alt="' + html(movie.title) + '">' +
        '<span><strong>' + html(movie.title) + '</strong>' +
        '<span>' + html(movie.year) + ' · ' + html(movie.region) + ' · ' + html(movie.genre) + '</span></span>' +
        '</a>';
    }).join('');
    searchPanel.classList.add('is-open');
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      renderSearch(input.value);
    });
    input.addEventListener('focus', function () {
      renderSearch(input.value);
    });
  });

  document.addEventListener('click', function (event) {
    if (!searchPanel) {
      return;
    }
    if (!event.target.closest('.search-shell')) {
      searchPanel.classList.remove('is-open');
    }
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
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

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var pageSearch = document.querySelector('.page-search-input');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  var empty = document.querySelector('[data-empty-state]');
  var activeFilter = 'all';

  function filterCards() {
    if (!cards.length) {
      return;
    }
    var query = pageSearch ? pageSearch.value.trim().toLowerCase() : '';
    var visible = 0;
    cards.forEach(function (card) {
      var text = (card.getAttribute('data-haystack') || '').toLowerCase();
      var terms = (card.getAttribute('data-terms') || '').toLowerCase();
      var matchesQuery = !query || text.indexOf(query) !== -1;
      var matchesFilter = activeFilter === 'all' || terms.indexOf(activeFilter) !== -1;
      var show = matchesQuery && matchesFilter;
      card.style.display = show ? '' : 'none';
      if (show) {
        visible += 1;
      }
    });
    if (empty) {
      empty.style.display = visible ? 'none' : 'block';
    }
  }

  if (pageSearch) {
    pageSearch.addEventListener('input', filterCards);
  }

  document.querySelectorAll('.filter-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.filter-chip').forEach(function (other) {
        other.classList.remove('is-active');
      });
      chip.classList.add('is-active');
      activeFilter = chip.getAttribute('data-filter') || 'all';
      filterCards();
    });
  });
})();
