export type RemoteMethod = "exists" | "new" | "get" | "set" | "invokeMethod";

export type ObjectIdentifier = string;

export interface RemoteObjectCall {
  method: RemoteMethod;
  callObj?: Call;
}

export interface Call {
  prop?: string;
  value?: any;
  objectID: ObjectIdentifier;
  flags?: {
    isFunction?: boolean;
  };
}

export type RemoteObjectResponse<T> = {
  value: T;
  flags?: {
    isFunction?: boolean;
  };
};
