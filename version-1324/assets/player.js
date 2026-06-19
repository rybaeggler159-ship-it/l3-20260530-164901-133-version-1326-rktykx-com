(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector(".play-overlay");
      var message = player.querySelector(".player-message");
      var hls = null;
      var attached = false;

      if (!video || !button) {
        return;
      }

      function showMessage(text) {
        if (message) {
          message.textContent = text;
          message.hidden = false;
        }
      }

      function attach() {
        if (attached) {
          return;
        }

        var stream = video.getAttribute("data-stream") || "";
        if (!stream) {
          showMessage("视频暂时不可用");
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          attached = true;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (_, data) {
            if (data && data.fatal) {
              if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
              } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
              } else {
                showMessage("视频暂时不可用");
              }
            }
          });
          attached = true;
          return;
        }

        showMessage("视频暂时不可用");
      }

      function play() {
        attach();
        video.controls = true;
        button.classList.add("is-hidden");
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            video.addEventListener("canplay", function () {
              video.play().catch(function () {});
            }, { once: true });
          });
        }
      }

      button.addEventListener("click", play);
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener("play", function () {
        button.classList.add("is-hidden");
      });
      video.addEventListener("pause", function () {
        if (video.currentTime === 0) {
          button.classList.remove("is-hidden");
        }
      });
      window.addEventListener("beforeunload", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  });
})();
