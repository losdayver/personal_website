import { iconsPath } from "../routes.js";
import { MusicPlayer } from "./player.js";

const contents = document.getElementsByClassName(
  "music-widget-current"
)[0] as HTMLDivElement;
const handle = document.getElementsByClassName(
  "music-widget-handle"
)[0] as HTMLDivElement;
const thumbnail = document.getElementsByClassName(
  "music-widget-cover"
)[0] as HTMLImageElement;
const songName = document.getElementsByClassName(
  "music-widget-song-name"
)[0] as HTMLDivElement;
const skipBack = document.getElementsByClassName(
  "music-widget-button-backwards"
)[0] as HTMLButtonElement;
const skipFrwd = document.getElementsByClassName(
  "music-widget-button-forwards"
)[0] as HTMLButtonElement;
const play = document.getElementsByClassName(
  "music-widget-button-play"
)[0] as HTMLButtonElement;
const loop = document.getElementsByClassName(
  "music-widget-button-repeat"
)[0] as HTMLButtonElement;

export const initMusicWidget = () => {
  play.addEventListener("click", widgetToggle);
  skipBack.addEventListener("click", () => widgetSkip("backwards"));
  skipFrwd.addEventListener("click", () => widgetSkip("forwards"));
  handle.addEventListener("click", widgetToggleHidden);
  loop.addEventListener("click", toggleRepeat);
};

const widgetPlay = () => {
  if (MusicPlayer.lastActivePlayer) {
    MusicPlayer.lastActivePlayer.play();
    $($(play).children()[0]).attr("src", `${iconsPath}pause.svg`);
  }
};
const widgetPause = () => {
  if (MusicPlayer.lastActivePlayer) {
    MusicPlayer.lastActivePlayer.pause();
    $($(play).children()[0]).attr("src", `${iconsPath}play-fill.svg`);
  }
};
const widgetToggle = () => {
  if (!MusicPlayer.lastActivePlayer) return;
  if (MusicPlayer.lastActivePlayer.isPlaying) widgetPause();
  else widgetPlay();
};

const widgetSkip = (direction: "forwards" | "backwards") => {
  if (MusicPlayer.lastActivePlayer) {
    MusicPlayer.lastActivePlayer.skip(direction);
  }
};

export const widgetOnPlay = () => {
  thumbnail.src = MusicPlayer.lastActivePlayer.coverImage.src;
  songName.innerHTML = MusicPlayer.lastActivePlayer.songName;
  $($(play).children()[0]).attr("src", `${iconsPath}pause.svg`);
};

export const widgetOnPause = () => {
  $($(play).children()[0]).attr("src", `${iconsPath}play-fill.svg`);
};

export const widgetReveal = () => {
  contents.classList.remove("music-player-folded");
};

export const widgetHide = () => {
  contents.classList.add("music-player-folded");
};

const widgetToggleHidden = () => {
  if (contents.classList.contains("music-player-folded")) widgetReveal();
  else widgetHide();
};

const toggleRepeat = () => {
  MusicPlayer.loopAll = !MusicPlayer.loopAll;
  if (MusicPlayer.loopAll) loop.classList.add("music-widget-looping");
  else loop.classList.remove("music-widget-looping");
};
