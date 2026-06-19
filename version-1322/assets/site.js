(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var open = mobilePanel.hasAttribute('hidden');
      if (open) {
        mobilePanel.removeAttribute('hidden');
      } else {
        mobilePanel.setAttribute('hidden', '');
      }
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5600);
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  var emptyState = document.querySelector('.empty-state');
  var inputs = Array.prototype.slice.call(document.querySelectorAll('.search-input'));

  function filterCards(value) {
    var query = value.trim().toLowerCase();
    var visible = 0;

    if (!cards.length) {
      return;
    }

    cards.forEach(function (card) {
      var haystack = (card.getAttribute('data-search') || '').toLowerCase();
      var matched = !query || haystack.indexOf(query) !== -1;
      card.hidden = !matched;
      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visible !== 0;
    }
  }

  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      inputs.forEach(function (other) {
        if (other !== input) {
          other.value = input.value;
        }
      });
      filterCards(input.value);
    });

    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && !cards.length && input.value.trim()) {
        var prefix = location.pathname.indexOf('/movie/') !== -1 ? '../' : '';
        location.href = prefix + 'index.html?q=' + encodeURIComponent(input.value.trim()) + '#all-movies';
      }
    });
  });

  var params = new URLSearchParams(location.search);
  var query = params.get('q');
  if (query) {
    inputs.forEach(function (input) {
      input.value = query;
    });
    filterCards(query);
  }
}());
