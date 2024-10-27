import { Call, RemoteMethod, RemoteObjectResponse } from "./meta";

export const remoteUrl = "/api/remote";

const makeGenericRequest = async (method: RemoteMethod, callObj?: Call) => {
  const res = await fetch(remoteUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ method, callObj })
  });
  try {
    return (await res.json()) as RemoteObjectResponse<any>;
  } catch {}
};

const localStorageKey = "remoteObjects";

if (!localStorage.getItem(localStorageKey))
  localStorage.setItem(localStorageKey, "{}");

export const newRemote = async (objKey?: string) => {
  return await makeRemote("new", objKey);
};

export const restoreRemote = async (objKey: string) => {
  return await makeRemote("restore", objKey);
};

export const assertRemote = async (objKey: string) => {
  const objectID = JSON.parse(localStorage.getItem(localStorageKey))[objKey];
  if (
    objectID &&
    (await makeGenericRequest("exists", { objectID: objectID })).value
  )
    return await restoreRemote(objKey);
  return await newRemote(objKey);
};

const makeRemote = async (method: "new" | "restore", objKey?: string) => {
  let objectID: string;
  if (method == "new") {
    objectID = (await makeGenericRequest("new")).value;
    if (objKey) {
      let newStore = { [objKey]: objectID };
      const store = localStorage.getItem(localStorageKey);
      if (store) newStore = { ...JSON.parse(store), ...newStore };
      localStorage.setItem(localStorageKey, JSON.stringify(newStore));
    }
  } else {
    objectID = JSON.parse(localStorage.getItem(localStorageKey))[objKey];
    if (!objectID)
      throw new Error("no object is stored with given key " + objKey);
  }
  return new Proxy(
    { _private: { objectID, setterPromise: undefined } } as any,
    {
      async get(target, prop) {
        if (["then", "catch", "_private"].includes(prop as string)) return true;
        if (target._private.setterPromise) await target._private.setterPromise;
        const res = await makeGenericRequest("get", {
          prop: prop as string,
          objectID: target._private.objectID
        });
        if (res.flags?.isFunction) {
          return async function () {
            return (
              await makeGenericRequest("invokeMethod", {
                prop: prop as string,
                value: arguments.length ? Array.from(arguments) : [],
                objectID: target._private.objectID
              })
            ).value;
          };
        }
        return res.value;
      },
      set(target, prop, value) {
        const call: Call = {
          prop: prop as string,
          objectID: target._private.objectID
        };
        if ((typeof value as any) == "function") {
          call.value = value.toString();
          call.flags = { isFunction: true };
        } else call.value = value;
        target._private.setterPromise = makeGenericRequest("set", call);
        return true;
      }
    }
  );
};
