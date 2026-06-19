
(function () {
  function setupPlayer(root) {
    var video = root.querySelector("video");
    var cover = root.querySelector(".player-cover");
    var message = root.querySelector(".player-message");
    if (!video) {
      return;
    }

    var stream = video.getAttribute("data-stream");
    var hls = null;

    function showMessage(text) {
      if (!message) {
        return;
      }
      message.textContent = text;
      message.classList.add("is-visible");
    }

    function hideCover() {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    }

    function attachStream() {
      if (!stream) {
        showMessage("视频加载失败，请刷新页面重试");
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showMessage("视频加载失败，请刷新页面重试");
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else {
        showMessage("当前浏览器不支持该视频播放");
      }
    }

    function startPlayback() {
      hideCover();
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          if (cover) {
            cover.classList.remove("is-hidden");
          }
        });
      }
    }

    attachStream();

    if (cover) {
      cover.addEventListener("click", startPlayback);
    }

    video.addEventListener("play", hideCover);
    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.forEach.call(document.querySelectorAll(".js-player"), setupPlayer);
  });
})();
