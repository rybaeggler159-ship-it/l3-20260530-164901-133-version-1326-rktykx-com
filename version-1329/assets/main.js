(function () {
  var button = document.querySelector('[data-mobile-menu-button]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (button && menu) {
    button.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length > 0) {
    var current = 0;
    var showSlide = function (index) {
      current = index;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('active', itemIndex === current);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('active', itemIndex === current);
      });
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });
    showSlide(0);
    if (slides.length > 1) {
      setInterval(function () {
        showSlide((current + 1) % slides.length);
      }, 5200);
    }
  }

  var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
  inputs.forEach(function (input) {
    var wrapper = input.closest('main') || document;
    var empty = wrapper.querySelector('[data-search-empty]');
    var items = Array.prototype.slice.call(wrapper.querySelectorAll('[data-search-item]'));
    input.addEventListener('input', function () {
      var keyword = input.value.trim().toLowerCase();
      var visible = 0;
      items.forEach(function (item) {
        var text = ((item.getAttribute('data-title') || '') + ' ' + (item.getAttribute('data-tags') || '') + ' ' + item.textContent).toLowerCase();
        var match = keyword === '' || text.indexOf(keyword) !== -1;
        item.hidden = !match;
        if (match) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    });
  });
})();

function initMoviePlayer(videoId, coverId, streamUrl) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  if (!video || !cover || !streamUrl) {
    return;
  }

  var attached = false;
  var attach = function () {
    if (attached) {
      return;
    }
    attached = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      video.hlsController = hls;
    } else {
      video.src = streamUrl;
    }
  };

  var play = function () {
    attach();
    cover.classList.add('hidden');
    video.controls = true;
    var started = video.play();
    if (started && typeof started.catch === 'function') {
      started.catch(function () {
        video.controls = true;
      });
    }
  };

  cover.addEventListener('click', play);
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
}
