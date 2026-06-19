(function () {
  var form = document.querySelector('[data-search-form]');
  var input = document.querySelector('[data-search-input]');
  var output = document.querySelector('[data-search-results]');
  var count = document.querySelector('[data-search-count]');
  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';

  if (!form || !input || !output) {
    return;
  }

  input.value = initial;

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>\"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '\"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function render(query) {
    var q = normalize(query);
    var data = window.SEARCH_INDEX || [];
    var results = q ? data.filter(function (item) {
      var haystack = normalize([
        item.title,
        item.description,
        item.genre,
        item.region,
        item.type,
        item.tags
      ].join(' '));
      return haystack.indexOf(q) !== -1;
    }).slice(0, 80) : data.slice(0, 24);

    if (count) {
      count.textContent = q ? '找到 ' + results.length + ' 条相关影片' : '为你推荐 ' + results.length + ' 部影片';
    }

    if (!results.length) {
      output.innerHTML = '<div class="empty-state">没有找到匹配的影片</div>';
      return;
    }

    output.innerHTML = results.map(function (item) {
      var title = escapeHtml(item.title);
      var description = escapeHtml(item.description);
      var genre = escapeHtml(item.genre);
      var region = escapeHtml(item.region);
      var year = escapeHtml(item.year);
      var url = encodeURI(item.url);
      var cover = encodeURI(item.cover);

      return [
        '<article class="rank-card">',
        '  <a class="rank-thumb" href="' + url + '">',
        '    <img src="' + cover + '" alt="' + title + '" loading="lazy">',
        '  </a>',
        '  <div class="rank-info">',
        '    <a href="' + url + '"><h3>' + title + '</h3></a>',
        '    <p>' + description + '</p>',
        '    <div class="card-meta">',
        '      <span>' + year + '</span>',
        '      <span>' + genre + '</span>',
        '      <span>' + region + '</span>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var query = input.value.trim();
    var url = new URL(window.location.href);

    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }

    window.history.replaceState({}, '', url.toString());
    render(query);
  });

  input.addEventListener('input', function () {
    render(input.value);
  });

  render(initial);
})();
