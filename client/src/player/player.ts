import { iconsPath } from "../routes.js";

const placeholders = document.getElementsByClassName("post-player");

let nowPlayingPlayPauseButton: JQuery<HTMLButtonElement> = null;
let nowPlaying = false;

const initPlayers = () => {
  for (let p of placeholders) {
    const songName = p.getAttribute("songName");
    const audioPath = p.getAttribute("audioPath");
    const thumbnailPath = p.getAttribute("thumbnailPath");

    const postPlayer = $(p);

    const coverImage = $(
      `<img class="post-player-cover" src="${thumbnailPath}">`
    );
    postPlayer.append(coverImage);
    const controlsDiv = $('<div class="post-player-controls"></div>');
    const seekBar = $<HTMLProgressElement>(
      '<input class="post-player-slider" type="range" value="0">'
    );
    controlsDiv.append(seekBar);
    const title = $(`<h3 class="post-player-title">${songName}</h3>`);
    controlsDiv.append(title);
    const timestamp = $('<p class="post-player-timestamp"></p>');
    controlsDiv.append(timestamp);
    const buttonsDiv = $('<div class="post-player-controls-buttons"></div>');
    const skipBackwardButton = $(
      `<button class="post-player-controls-buttons-back"><img src="${iconsPath}skip-backward-btn.svg" alt="backward"></button>`
    );
    buttonsDiv.append(skipBackwardButton);
    const playPauseButton = $<HTMLButtonElement>(
      `<button class="post-player-controls-buttons-play"><img src="${iconsPath}play.svg" alt="play"></button>`
    );
    buttonsDiv.append(playPauseButton);
    const skipForwardButton = $(
      `<button class="post-player-controls-buttons-forward"><img src="${iconsPath}skip-forward-btn.svg" alt="forward"></button>`
    );
    buttonsDiv.append(skipForwardButton);
    controlsDiv.append(buttonsDiv);
    const audio = $<HTMLAudioElement>(
      `<audio><source src="${audioPath}" type="audio/mpeg"></audio>`
    );
    controlsDiv.append(audio);
    postPlayer.append(controlsDiv);

    window.addEventListener("load", () => {
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
        const duration = audio[0].duration ?? 0;
        return `${getFromSeconds(
          duration * ((seekBar[0].value ?? 0) / 100)
        )} / ${getFromSeconds(duration)}`;
      };

      timestamp[0].innerText = getTimestamp();
      let isPlaying = false;

      playPauseButton[0].addEventListener("click", function () {
        if (isPlaying) {
          audio[0].pause();
          nowPlaying = false;
          $(playPauseButton.children()[0]).attr("src", `${iconsPath}play.svg`);
        } else {
          if (
            nowPlayingPlayPauseButton &&
            nowPlaying &&
            nowPlayingPlayPauseButton != playPauseButton
          )
            nowPlayingPlayPauseButton.click();
          nowPlayingPlayPauseButton = playPauseButton;
          audio[0].play();
          nowPlaying = true;
          $(playPauseButton.children()[0]).attr("src", `${iconsPath}pause.svg`);
        }
        isPlaying = !isPlaying;
      });

      skipBackwardButton[0].addEventListener(
        "click",
        () => (audio[0].currentTime -= 10)
      );

      skipForwardButton[0].addEventListener(
        "click",
        () => (audio[0].currentTime += 10)
      );

      audio[0].addEventListener("timeupdate", () => {
        seekBar[0].value = (audio[0].currentTime / audio[0].duration) * 100;
        timestamp[0].innerText = getTimestamp();
      });

      seekBar[0].addEventListener("input", () => {
        audio[0].currentTime = (audio[0].duration * seekBar[0].value) / 100;
        timestamp[0].innerText = getTimestamp();
      });
    });
  }
};

initPlayers();
