(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) return;
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
      toggle.textContent = panel.classList.contains('is-open') ? '×' : '☰';
    });
  }

  function initHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) return;
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function start() {
      if (slides.length < 2) return;
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(i);
        start();
      });
    });

    start();
  }

  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function cardText(card) {
    return normalize([
      card.getAttribute('data-title'),
      card.getAttribute('data-genre'),
      card.getAttribute('data-region'),
      card.getAttribute('data-year'),
      card.getAttribute('data-category'),
      card.textContent
    ].join(' '));
  }

  function applyFilter(root) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var textInput = root.querySelector('[data-page-filter]') || document.querySelector('[data-global-search]');
    var query = normalize(textInput ? textInput.value : '');
    var regionButton = root.querySelector('[data-filter-region].is-active');
    var yearButton = root.querySelector('[data-filter-year].is-active');
    var region = regionButton ? normalize(regionButton.getAttribute('data-filter-region')) : '';
    var year = yearButton ? normalize(yearButton.getAttribute('data-filter-year')) : '';

    cards.forEach(function (card) {
      var okText = !query || cardText(card).indexOf(query) !== -1;
      var okRegion = !region || normalize(card.getAttribute('data-region')) === region;
      var okYear = !year || normalize(card.getAttribute('data-year')) === year;
      card.classList.toggle('is-hidden', !(okText && okRegion && okYear));
    });
  }

  function initFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function (panel) {
      var input = panel.querySelector('[data-page-filter]');
      if (input) {
        input.addEventListener('input', function () {
          applyFilter(panel);
        });
      }

      panel.querySelectorAll('[data-filter-region], [data-filter-year], [data-filter-clear]').forEach(function (button) {
        button.addEventListener('click', function () {
          var group = button.parentElement;
          Array.prototype.slice.call(group.children).forEach(function (item) {
            item.classList.remove('is-active');
          });
          button.classList.add('is-active');
          if (button.hasAttribute('data-filter-clear')) {
            panel.querySelectorAll('[data-filter-region], [data-filter-year]').forEach(function (item) {
              item.classList.remove('is-active');
            });
          }
          applyFilter(panel);
        });
      });
    });
  }

  function initSearchPage() {
    var page = document.querySelector('[data-search-page]');
    if (!page) return;
    var mainInput = page.querySelector('[data-global-search]');
    var button = page.querySelector('[data-search-button]');
    var filterPanel = page.querySelector('[data-filter-panel]') || page;
    var initial = getQueryParam('q');
    if (mainInput) {
      mainInput.value = initial;
      mainInput.addEventListener('input', function () {
        var panelInput = page.querySelector('[data-page-filter]');
        if (panelInput) panelInput.value = mainInput.value;
        applyFilter(filterPanel);
      });
    }
    var panelInput = page.querySelector('[data-page-filter]');
    if (panelInput) {
      panelInput.value = initial;
    }
    if (button) {
      button.addEventListener('click', function () {
        applyFilter(filterPanel);
      });
    }
    applyFilter(filterPanel);
  }

  function initSearchForms() {
    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        if (!input || !input.value.trim()) {
          event.preventDefault();
          window.location.href = './search.html';
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initSearchPage();
    initSearchForms();
  });
})();
