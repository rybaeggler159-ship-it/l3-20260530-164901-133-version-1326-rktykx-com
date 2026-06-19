(function () {
  var player = document.querySelector('[data-player]');
  var overlay = document.querySelector('[data-play-overlay]');

  if (!player || !overlay) {
    return;
  }

  var source = player.getAttribute('data-stream');
  var prepared = false;

  function prepare() {
    if (prepared || !source) {
      return;
    }

    prepared = true;

    if (player.canPlayType('application/vnd.apple.mpegurl')) {
      player.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(player);
      return;
    }

    player.src = source;
  }

  function play() {
    prepare();
    overlay.style.display = 'none';
    var action = player.play();
    if (action && typeof action.catch === 'function') {
      action.catch(function () {
        overlay.style.display = 'grid';
      });
    }
  }

  overlay.addEventListener('click', play);
  player.addEventListener('click', function () {
    if (player.paused) {
      play();
    }
  });
})();
