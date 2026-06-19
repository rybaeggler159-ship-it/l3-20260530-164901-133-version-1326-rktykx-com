
(function () {
  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function setupMobileMenu() {
    var button = document.querySelector("[data-mobile-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle("is-active", current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle("is-active", current === index);
      });
    }

    function play() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function restart() {
      window.clearInterval(timer);
      play();
    }

    dots.forEach(function (dot, current) {
      dot.addEventListener("click", function () {
        show(current);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }

    play();
  }

  function setupFilters() {
    var root = document.querySelector("[data-filter-root]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    if (!root || !cards.length) {
      return;
    }
    var search = root.querySelector("[data-filter-search]");
    var year = root.querySelector("[data-filter-year]");
    var region = root.querySelector("[data-filter-region]");
    var type = root.querySelector("[data-filter-type]");
    var reset = root.querySelector("[data-filter-reset]");
    var empty = document.querySelector("[data-filter-empty]");
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q");

    if (initialQuery && search) {
      search.value = initialQuery;
    }

    function apply() {
      var query = normalize(search && search.value);
      var yearValue = normalize(year && year.value);
      var regionValue = normalize(region && region.value);
      var typeValue = normalize(type && type.value);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year")
        ].join(" "));
        var matched = true;
        if (query && haystack.indexOf(query) === -1) {
          matched = false;
        }
        if (yearValue && normalize(card.getAttribute("data-year")) !== yearValue) {
          matched = false;
        }
        if (regionValue && normalize(card.getAttribute("data-region")) !== regionValue) {
          matched = false;
        }
        if (typeValue && normalize(card.getAttribute("data-type")) !== typeValue) {
          matched = false;
        }
        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    [search, year, region, type].forEach(function (control) {
      if (!control) {
        return;
      }
      control.addEventListener("input", apply);
      control.addEventListener("change", apply);
    });

    if (reset) {
      reset.addEventListener("click", function () {
        if (search) {
          search.value = "";
        }
        if (year) {
          year.value = "";
        }
        if (region) {
          region.value = "";
        }
        if (type) {
          type.value = "";
        }
        apply();
      });
    }

    apply();
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    setupHero();
    setupFilters();
  });
})();
