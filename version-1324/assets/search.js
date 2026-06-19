(function () {
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 4).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");

    return "" +
      "<article class=\"movie-card\">" +
        "<a class=\"movie-cover\" href=\"" + escapeHtml(movie.url) + "\" aria-label=\"" + escapeHtml(movie.title) + "\">" +
          "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\" decoding=\"async\">" +
          "<span class=\"movie-badge\">" + escapeHtml(movie.category) + "</span>" +
        "</a>" +
        "<div class=\"movie-body\">" +
          "<a class=\"movie-title\" href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a>" +
          "<p class=\"movie-desc\">" + escapeHtml(movie.description) + "</p>" +
          "<div class=\"movie-meta\">" +
            "<span>" + escapeHtml(movie.year) + "</span>" +
            "<span>" + escapeHtml(movie.region) + "</span>" +
            "<span>" + escapeHtml(movie.type) + "</span>" +
            "<span>" + escapeHtml(movie.score) + "分</span>" +
          "</div>" +
          "<div class=\"tag-row\">" + tags + "</div>" +
        "</div>" +
      "</article>";
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim().toLowerCase();
    var results = document.getElementById("search-results");
    var empty = document.getElementById("search-empty");
    var title = document.getElementById("search-title");
    var desc = document.getElementById("search-desc");
    var input = document.querySelector(".search-page-form input[name='q']");
    var data = window.SEARCH_MOVIES || [];

    if (input) {
      input.value = query;
    }

    var matched;
    if (query) {
      matched = data.filter(function (movie) {
        var text = [
          movie.title,
          movie.description,
          movie.genre,
          movie.category,
          movie.region,
          movie.year,
          (movie.tags || []).join(" ")
        ].join(" ").toLowerCase();
        return text.indexOf(query) !== -1;
      });
      if (title) {
        title.textContent = "搜索结果";
      }
      if (desc) {
        desc.textContent = "关键词：“" + query + "”";
      }
    } else {
      matched = data.slice(0, 24);
      if (title) {
        title.textContent = "热播推荐";
      }
      if (desc) {
        desc.textContent = "输入关键词后可匹配更多影片。";
      }
    }

    if (results) {
      results.innerHTML = matched.map(card).join("");
    }

    if (empty) {
      empty.hidden = matched.length !== 0;
    }
  });
})();
