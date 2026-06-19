(function () {
  function normalizeText(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-button]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) return;
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) return;
    var index = 0;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
      });
    });

    window.setInterval(function () {
      show(index + 1);
    }, 5000);
  }

  function initFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll('.js-filter-scope'));
    scopes.forEach(function (scope) {
      var input = scope.querySelector('[data-filter-search]');
      var type = scope.querySelector('[data-filter-type]');
      var year = scope.querySelector('[data-filter-year]');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
      if (!cards.length) return;

      function applyFilters() {
        var keyword = normalizeText(input && input.value);
        var selectedType = normalizeText(type && type.value);
        var selectedYear = normalizeText(year && year.value);
        cards.forEach(function (card) {
          var text = normalizeText([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-year'),
            card.getAttribute('data-tags')
          ].join(' '));
          var typeText = normalizeText(card.getAttribute('data-type'));
          var yearText = normalizeText(card.getAttribute('data-year'));
          var matched = (!keyword || text.indexOf(keyword) !== -1) &&
            (!selectedType || typeText === selectedType) &&
            (!selectedYear || yearText === selectedYear);
          card.classList.toggle('is-filter-hidden', !matched);
        });
      }

      [input, type, year].forEach(function (control) {
        if (!control) return;
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      });
    });
  }

  window.initMoviePlayer = function (videoId, buttonId, sourceUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    if (!video || !button || !sourceUrl) return;
    var loaded = false;
    var hls = null;

    function loadVideo() {
      if (loaded) return;
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }
      video.controls = true;
    }

    function startVideo() {
      loadVideo();
      button.classList.add('is-hidden');
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    }

    button.addEventListener('click', startVideo);
    video.addEventListener('click', function () {
      if (video.paused) startVideo();
    });
    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });
    video.addEventListener('ended', function () {
      button.classList.remove('is-hidden');
    });
    window.addEventListener('beforeunload', function () {
      if (hls && typeof hls.destroy === 'function') hls.destroy();
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
  });
})();
