(function () {
  function setupPlayer(config) {
    var video = document.querySelector(config.video || '#movie-video');
    var trigger = document.querySelector(config.trigger || '#play-button');
    var layer = document.querySelector(config.layer || '#play-layer');
    var stream = config.stream;
    var hls = null;
    var ready = false;

    if (!video || !stream) {
      return;
    }

    function bind() {
      if (ready) {
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function play() {
      bind();

      if (layer) {
        layer.classList.add('is-hidden');
      }

      var action = video.play();

      if (action && typeof action.catch === 'function') {
        action.catch(function () {
          if (layer) {
            layer.classList.remove('is-hidden');
          }
        });
      }
    }

    if (trigger) {
      trigger.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      if (layer) {
        layer.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (layer && video.currentTime === 0) {
        layer.classList.remove('is-hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  }

  window.setupPlayer = setupPlayer;
})();
