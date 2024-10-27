const players = document.getElementsByClassName("post-player");

const buildPlayers = () => {
  for (let player of players) {
    const audio = player.querySelector("audio") as HTMLAudioElement;
    const playPauseButton = player.querySelector(
      ".post-player-controls-buttons-play"
    ) as HTMLElement;
    const skipBackwardButton = player.querySelector(
      ".post-player-controls-buttons-back"
    ) as HTMLElement;
    const skipForwardButton = player.querySelector(
      ".post-player-controls-buttons-forward"

    ) as HTMLElement;
    const seekBar = player.querySelector(
      ".post-player-slider"
    ) as HTMLProgressElement;
    const timestamp = player.querySelector(
      ".post-player-timestamp"
    ) as HTMLElement;
    const getTimestamp = () => {
      const getFromSeconds = (duration: number) => {
        let min = +Math.floor(duration / 60)
          .toString()
          .padStart(2, "0");
        let sec = Math.floor(duration - min * 60)
          .toString()
          .padStart(2, "0");
        return `${min}:${sec}`;
      };
      const duration = audio.duration ?? 0;
      return `${getFromSeconds(
        duration * ((seekBar.value ?? 0) / 100)
      )} / ${getFromSeconds(duration)}`;
    };
    timestamp.innerText = getTimestamp();
    let isPlaying = false;
    playPauseButton.addEventListener("click", function () {
      if (isPlaying) audio.pause();
      else audio.play();
      isPlaying = !isPlaying;
    });
    skipBackwardButton.addEventListener(
      "click",
      () => (audio.currentTime -= 10)
    );
    skipForwardButton.addEventListener(
      "click",
      () => (audio.currentTime += 10)
    );
    audio.addEventListener("timeupdate", () => {
      seekBar.value = (audio.currentTime / audio.duration) * 100;
      timestamp.innerText = getTimestamp();
    });
    seekBar.addEventListener("input", () => {
      audio.currentTime = (audio.duration * seekBar.value) / 100;
      timestamp.innerText = getTimestamp();
    });
  }
};

window.addEventListener("load", buildPlayers);
