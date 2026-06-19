(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function initVideo(video) {
    if (!video || video.dataset.ready === '1') return;
    var src = video.getAttribute('data-hls');
    if (!src) return;
    video.dataset.ready = '1';

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          showMessage(video, '视频暂时无法播放，请稍后重试');
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else {
      video.src = src;
    }
  }

  function showMessage(video, message) {
    var shell = video.closest('[data-player-shell]');
    var target = shell ? shell.querySelector('[data-player-message]') : null;
    if (target) target.textContent = message;
  }

  function initPlayers() {
    document.querySelectorAll('video[data-hls]').forEach(function (video) {
      var shell = video.closest('[data-player-shell]');
      var start = shell ? shell.querySelector('.player-start') : null;
      initVideo(video);

      function play() {
        initVideo(video);
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            showMessage(video, '点击视频区域即可开始播放');
          });
        }
      }

      if (start) {
        start.addEventListener('click', play);
      }

      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });

      video.addEventListener('play', function () {
        if (shell) shell.classList.add('is-playing');
      });

      video.addEventListener('pause', function () {
        if (shell) shell.classList.remove('is-playing');
      });
    });
  }

  ready(initPlayers);
})();
