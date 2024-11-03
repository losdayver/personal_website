import { iconsPath } from "../routes.js";

const placeholders = document.getElementsByClassName(
  "music-player"
) as HTMLCollectionOf<HTMLDivElement>;

const initPlayers = () => {
  for (const p of placeholders) {
    new MusicPlayer(p);
  }
};

window.addEventListener("load", initPlayers);

class MusicPlayer {
  static lastActivePlayer: MusicPlayer = null;
  static playersList: MusicPlayer[] = [];
  static loopAll = false;
  isPlaying = false;

  songName: string;
  audioPath: string;
  thumbnailPath: string;

  musicPlayer: HTMLDivElement;
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
      `${iconsPath}play-fill.svg`
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

  setTime = (percents: number) => {
    this.audio.currentTime = (this.audio.duration * percents) / 100;
    this.timestamp.innerText = this.getTimestamp();
    this.seekBar.value = percents;
  };

  skip = (direction: "forwards" | "backwards") => {
    let currentId = MusicPlayer.playersList.indexOf(this);

    if (direction == "forwards") currentId++;
    else currentId--;

    if (currentId < 0) currentId = MusicPlayer.playersList.length - 1;

    const nextPlayer =
      MusicPlayer.playersList[currentId % MusicPlayer.playersList.length];
    nextPlayer.setTime(0);
    nextPlayer.play();
    this.scrollTo(nextPlayer.musicPlayer);
  };

  scrollTo = (element: HTMLElement) => {
    const y = element.getBoundingClientRect().top + window.scrollY;
    window.scroll({
      top: y,
      behavior: "smooth"
    });
  };

  initLogic = () => {
    this.timestamp.innerText = this.getTimestamp();

    this.playPauseButton.addEventListener("click", this.toggle);

    this.skipBackwardButton.addEventListener("click", () =>
      this.skip("backwards")
    );

    this.skipForwardButton.addEventListener("click", () =>
      this.skip("forwards")
    );

    this.audio.addEventListener("timeupdate", () => {
      this.seekBar.value = (this.audio.currentTime / this.audio.duration) * 100;
      this.timestamp.innerText = this.getTimestamp();
    });

    this.seekBar.addEventListener("input", () => {
      this.audio.currentTime = (this.audio.duration * this.seekBar.value) / 100;
      this.timestamp.innerText = this.getTimestamp();
    });

    this.audio.addEventListener("ended", () => {
      this.setTime(0);
      this.pause();
      if (MusicPlayer.loopAll) this.skip("forwards");
    });
  };

  constructor(playerPlaceholder: HTMLDivElement) {
    MusicPlayer.playersList.push(this);

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
      `<button class="music-player-controls-buttons-back"><img src="${iconsPath}skip-start-fill.svg" alt="backward"></button>`
    );
    buttonsDiv.append(skipBackwardButton);
    const playPauseButton = $<HTMLButtonElement>(
      `<button class="music-player-controls-buttons-play"><img src="${iconsPath}play-fill.svg" alt="play"></button>`
    );
    buttonsDiv.append(playPauseButton);
    const skipForwardButton = $<HTMLButtonElement>(
      `<button class="music-player-controls-buttons-forward"><img src="${iconsPath}skip-end-fill.svg" alt="forward"></button>`
    );
    buttonsDiv.append(skipForwardButton);
    controlsDiv.append(buttonsDiv);
    const audio = $<HTMLAudioElement>(
      `<audio><source src="${this.audioPath}" type="audio/mpeg"></audio>`
    );
    controlsDiv.append(audio);
    postPlayer.append(controlsDiv);

    this.musicPlayer = postPlayer[0];
    this.seekBar = seekBar[0];
    this.playPauseButton = playPauseButton[0];
    this.skipForwardButton = skipForwardButton[0];
    this.skipBackwardButton = skipBackwardButton[0];
    this.audio = audio[0];
    this.timestamp = timestamp[0];

    // checking if the audio loaded
    let retries = 10;
    const interval = window.setInterval(() => {
      if (this.audio.duration) {
        this.initLogic();
        window.clearInterval(interval);
      } else if (retries <= 0) {
        console.log("audio can not be loaded");
      }
      retries -= 1;
    }, 100);
  }
}
