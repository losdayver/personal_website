import { iconsPath } from "../routes.js";

const placeholders = document.getElementsByClassName(
  "music-player"
) as HTMLCollectionOf<HTMLDivElement>;

const initPlayers = () => {
  for (const p of placeholders) {
    new MusicPlayer(p);
  }
};

class MusicPlayer {
  static lastActivePlayer: MusicPlayer = null;
  isPlaying = false;

  songName: string;
  audioPath: string;
  thumbnailPath: string;

  postPlayer: HTMLDivElement;
  seekBar: HTMLProgressElement;
  playPauseButton: HTMLButtonElement;
  skipForwardButton: HTMLButtonElement;
  skipBackwardButton: HTMLButtonElement;
  audio: HTMLAudioElement;
  timestamp: HTMLParagraphElement;

  play = () => {
    if (MusicPlayer.lastActivePlayer) MusicPlayer.lastActivePlayer.pause();
    this.audio.play();
    $($(this.playPauseButton).children()[0]).attr(
      "src",
      `${iconsPath}pause.svg`
    );
    MusicPlayer.lastActivePlayer = this;
    this.isPlaying = true;
  };

  pause = () => {
    this.audio.pause();
    $($(this.playPauseButton).children()[0]).attr(
      "src",
      `${iconsPath}play.svg`
    );
    MusicPlayer.lastActivePlayer = this;
    this.isPlaying = false;
  };

  toggle = () => {
    if (MusicPlayer.lastActivePlayer == this && this.isPlaying) this.pause();
    else this.play();
  };

  getTimestamp = () => {
    const getFromSeconds = (duration: number) => {
      let min = +Math.floor(duration / 60)
        .toString()
        .padStart(2, "0");
      let sec = Math.floor(duration - min * 60)
        .toString()
        .padStart(2, "0");
      return `${min}:${sec}`;
    };
    const duration = this.audio.duration ?? 0;
    return `${getFromSeconds(
      duration * ((this.seekBar.value ?? 0) / 100)
    )} / ${getFromSeconds(duration)}`;
  };

  initLogic = () => {
    this.timestamp.innerText = this.getTimestamp();

    this.playPauseButton.addEventListener("click", this.toggle);

    this.skipBackwardButton.addEventListener(
      "click",
      () => (this.audio.currentTime -= 10)
    );

    this.skipForwardButton.addEventListener(
      "click",
      () => (this.audio.currentTime += 10)
    );

    this.audio.addEventListener("timeupdate", () => {
      this.seekBar.value = (this.audio.currentTime / this.audio.duration) * 100;
      this.timestamp.innerText = this.getTimestamp();
    });

    this.seekBar.addEventListener("input", () => {
      this.audio.currentTime = (this.audio.duration * this.seekBar.value) / 100;
      this.timestamp.innerText = this.getTimestamp();
    });
  };

  constructor(playerPlaceholder: HTMLDivElement) {
    // getting div attributes
    this.songName = playerPlaceholder.getAttribute("songName");
    this.audioPath = playerPlaceholder.getAttribute("audioPath");
    this.thumbnailPath = playerPlaceholder.getAttribute("thumbnailPath");

    // building and rendering player based on attributes
    const postPlayer = $(playerPlaceholder);
    const coverImage = $(
      `<img class="music-player-cover" src="${this.thumbnailPath}">`
    );
    postPlayer.append(coverImage);
    const controlsDiv = $('<div class="music-player-controls"></div>');
    const seekBar = $<HTMLProgressElement>(
      '<input class="music-player-slider" type="range" value="0">'
    );
    controlsDiv.append(seekBar);
    const title = $(`<h3 class="music-player-title">${this.songName}</h3>`);
    controlsDiv.append(title);
    const timestamp = $<HTMLParagraphElement>(
      '<p class="music-player-timestamp">загрузка</p>'
    );
    controlsDiv.append(timestamp);
    const buttonsDiv = $('<div class="music-player-controls-buttons"></div>');
    const skipBackwardButton = $<HTMLButtonElement>(
      `<button class="music-player-controls-buttons-back"><img src="${iconsPath}skip-backward-btn.svg" alt="backward"></button>`
    );
    buttonsDiv.append(skipBackwardButton);
    const playPauseButton = $<HTMLButtonElement>(
      `<button class="music-player-controls-buttons-play"><img src="${iconsPath}play.svg" alt="play"></button>`
    );
    buttonsDiv.append(playPauseButton);
    const skipForwardButton = $<HTMLButtonElement>(
      `<button class="music-player-controls-buttons-forward"><img src="${iconsPath}skip-forward-btn.svg" alt="forward"></button>`
    );
    buttonsDiv.append(skipForwardButton);
    controlsDiv.append(buttonsDiv);
    const audio = $<HTMLAudioElement>(
      `<audio><source src="${this.audioPath}" type="audio/mpeg"></audio>`
    );
    controlsDiv.append(audio);
    postPlayer.append(controlsDiv);

    this.postPlayer = postPlayer[0];
    this.seekBar = seekBar[0];
    this.playPauseButton = playPauseButton[0];
    this.skipForwardButton = skipForwardButton[0];
    this.skipBackwardButton = skipBackwardButton[0];
    this.audio = audio[0];
    this.timestamp = timestamp[0];

    audio[0].addEventListener("canplay", this.initLogic);
  }
}

window.addEventListener("load", initPlayers);
