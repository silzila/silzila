import { AnyAction } from "redux";

let globalDispatch: ((action: AnyAction) => void) | null = null;

export const setGlobalDispatch = (dispatch: (action: AnyAction) => void) => {
  globalDispatch = dispatch;
};

export const dispatchAction = (action: AnyAction) => {
  if (globalDispatch) {
    globalDispatch(action);
  } else {
    console.warn("Dispatch function is not set yet!");
  }
};
