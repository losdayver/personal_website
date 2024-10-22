import { newRemote, restoreRemote, assertRemote } from "./remote.js";
import { runTest } from "./simpletests.js";

window.addEventListener("load", async () => {
  await runTest();

  // const valueInput = document.querySelector("#value") as HTMLInputElement;
  // const propInput = document.querySelector("#prop") as HTMLInputElement;
  // const getButton = document.querySelector("#get") as HTMLButtonElement;
  // const setButton = document.querySelector("#set") as HTMLButtonElement;
  // getButton.onclick = async () => {
  //   const val = await remote[propInput.value];
  //   valueInput.value = val;
  //   console.log(val);
  //   console.log(remote);
  // };
  // setButton.onclick = async () => {
  //   remote[propInput.value] = valueInput.value;
  // };
});
