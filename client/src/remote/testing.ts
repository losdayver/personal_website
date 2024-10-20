import { newRemote, restoreRemote, assertRemote } from "./remote.js";

window.addEventListener("load", async () => {
  // const remote = await restoreRemote("testObj");
  const remote = await assertRemote("wholenewinstance1");

  remote.a = 12;
  remote.b = 14;

  // @ts-ignore
  remote.func = function (arg) {
    return arg + this.b + this.a;
  };

  console.log(await (await remote.func)(100));

  const valueInput = document.querySelector("#value") as HTMLInputElement;
  const propInput = document.querySelector("#prop") as HTMLInputElement;
  const getButton = document.querySelector("#get") as HTMLButtonElement;
  const setButton = document.querySelector("#set") as HTMLButtonElement;

  getButton.onclick = async () => {
    const val = await remote[propInput.value];
    valueInput.value = val;
    console.log(val);
    console.log(remote);
  };
  setButton.onclick = async () => {
    remote[propInput.value] = valueInput.value;
  };
});
