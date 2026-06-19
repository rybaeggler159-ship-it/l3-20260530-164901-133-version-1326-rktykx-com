(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-nav-links]');
  var search = document.querySelector('[data-header-search]');

  if (toggle && nav && search) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      search.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var query = input ? input.value.trim() : '';
      var prefix = form.getAttribute('data-root') || './';
      if (query) {
        window.location.href = prefix + 'search.html?q=' + encodeURIComponent(query);
      } else {
        window.location.href = prefix + 'search.html';
      }
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  var searchPageInput = document.querySelector('[data-live-search]');
  var searchCards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));

  function runLiveSearch(value) {
    var keyword = (value || '').trim().toLowerCase();
    searchCards.forEach(function (card) {
      var haystack = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-meta')).toLowerCase();
      card.style.display = !keyword || haystack.indexOf(keyword) !== -1 ? '' : 'none';
    });
  }

  if (searchPageInput) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    searchPageInput.value = initial;
    runLiveSearch(initial);
    searchPageInput.addEventListener('input', function () {
      runLiveSearch(searchPageInput.value);
    });
  }
})();
