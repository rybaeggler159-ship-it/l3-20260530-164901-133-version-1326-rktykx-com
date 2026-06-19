(function () {
  function select(selector, context) {
    return (context || document).querySelector(selector);
  }

  function selectAll(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var toggle = select('[data-menu-toggle]');
    var panel = select('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slides = selectAll('[data-hero-slide]');
    var dots = selectAll('[data-hero-dot]');
    var prev = select('[data-hero-prev]');
    var next = select('[data-hero-next]');
    if (!slides.length) {
      return;
    }
    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function move(step) {
      show(active + step);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        move(1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        move(-1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        move(1);
        restart();
      });
    }

    restart();
  }

  function setupSearchForms() {
    selectAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = select('input[name="q"]', form);
        if (!input || !input.value.trim()) {
          event.preventDefault();
          if (input) {
            input.focus();
          }
        }
      });
    });
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupPageFilter() {
    selectAll('[data-page-filter]').forEach(function (form) {
      var input = select('input', form);
      if (!input) {
        return;
      }
      input.addEventListener('input', function () {
        var query = normalize(input.value);
        selectAll('[data-card]').forEach(function (card) {
          var text = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-tags'),
            card.textContent
          ].join(' '));
          card.classList.toggle('is-filtered-out', query && text.indexOf(query) === -1);
        });
      });
      form.addEventListener('submit', function (event) {
        event.preventDefault();
      });
    });
  }

  function cardMarkup(item) {
    return [
      '<article class="movie-card compact">',
      '  <a class="poster-link" href="./' + item.file + '">',
      '    <img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '    <span class="poster-mask"><span>观看</span></span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <a class="movie-title" href="./' + item.file + '">' + escapeHtml(item.title) + '</a>',
      '    <p class="movie-desc">' + escapeHtml(item.oneLine) + '</p>',
      '    <p class="movie-meta">' + escapeHtml(item.year) + ' · ' + escapeHtml(item.region) + ' · ' + escapeHtml(item.type) + '</p>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupSearchPage() {
    var resultBox = select('[data-search-results]');
    if (!resultBox || !window.SEARCH_INDEX) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = normalize(params.get('q'));
    var title = select('[data-search-title]');
    var summary = select('[data-search-summary]');
    var searchInput = select('.inline-search input[name="q"]');
    if (searchInput && query) {
      searchInput.value = params.get('q');
    }
    if (!query) {
      return;
    }
    var words = query.split(/\s+/).filter(Boolean);
    var matches = window.SEARCH_INDEX.filter(function (item) {
      var haystack = normalize([
        item.title,
        item.region,
        item.type,
        item.year,
        item.genre,
        item.tags,
        item.oneLine
      ].join(' '));
      return words.every(function (word) {
        return haystack.indexOf(word) !== -1;
      });
    }).slice(0, 120);

    if (title) {
      title.textContent = '搜索结果';
    }
    if (summary) {
      summary.textContent = matches.length ? '已为你筛选出相关影片。' : '没有找到相关影片，可尝试更换关键词。';
    }
    resultBox.innerHTML = matches.length ? matches.map(cardMarkup).join('') : '';
  }

  function setupPlayer() {
    var cover = select('.player-cover');
    var video = select('.video-player');
    if (!cover || !video) {
      return;
    }
    var hlsPlayer = null;

    function start() {
      var stream = cover.getAttribute('data-stream');
      if (!stream) {
        return;
      }
      cover.classList.add('is-hidden');
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        if (video.src !== stream) {
          video.src = stream;
        }
        video.play().catch(function () {});
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        if (!hlsPlayer) {
          hlsPlayer = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsPlayer.loadSource(stream);
          hlsPlayer.attachMedia(video);
          hlsPlayer.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.play().catch(function () {});
        }
      } else {
        if (video.src !== stream) {
          video.src = stream;
        }
        video.play().catch(function () {});
      }
    }

    cover.addEventListener('click', start);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupSearchForms();
    setupPageFilter();
    setupSearchPage();
    setupPlayer();
  });
})();
