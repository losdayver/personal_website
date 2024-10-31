import { assertRemote, newRemote } from "remote";

export const runTest = async () => {
  const rm = await newRemote();
  rm.value = "Hello World!";

  rm.func = function () {
    let aboba = 123;
    //@ts-ignore
    aboba = "Hello world!";
    return aboba;
  };

  const res = await (await rm.func)();

  console.log(res);
};
