import { randomUUID } from "crypto";
import {
  ObjectIdentifier,
  RemoteObjectCall,
  RemoteObjectResponse
} from "../../../../client/src/remote/meta";
import { executeMethod } from "./context";

const objectMap = new Map<ObjectIdentifier, any>();

export const makeCall = async (
  remoteCall: RemoteObjectCall
): Promise<RemoteObjectResponse<any>> => {
  if (remoteCall.method == "new") return makeNew();
  else if (remoteCall.method == "get") {
    const value = objectMap.get(remoteCall.callObj.objectID)?.[
      remoteCall.callObj.prop
    ];
    if (typeof value != "function") {
      return { value };
    } else {
      return { value: undefined, flags: { isFunction: true } };
    }
  } else if (remoteCall.method == "set") {
    if (objectMap.has(remoteCall.callObj.objectID)) {
      const obj = objectMap.get(remoteCall.callObj.objectID);
      let newValue;
      if (typeof remoteCall.callObj.value == "number")
        newValue = remoteCall.callObj.value;
      else if (remoteCall.callObj?.flags?.isFunction) {
        const funcStr = remoteCall.callObj.value;
        newValue = () => funcStr;
      } else {
        try {
          newValue = JSON.parse(remoteCall.callObj.value);
        } catch {
          newValue = remoteCall.callObj.value;
        }
      }
      obj[remoteCall.callObj.prop] = newValue;
    }
  } else if (remoteCall.method == "invokeMethod") {
    const obj = objectMap.get(remoteCall.callObj.objectID);
    const value = await executeMethod(
      obj[remoteCall.callObj.prop](),
      remoteCall?.callObj?.value as any[],
      obj
    );
    return { value };
  } else if (remoteCall.method == "exists") {
    return { value: objectMap.has(remoteCall.callObj.objectID) };
  }
};

export const makeNew = (): RemoteObjectResponse<ObjectIdentifier> => {
  const id = randomUUID();
  objectMap.set(id, {});
  return { value: id };
};
