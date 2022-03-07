import { TAppState } from "./reducers/app-slice"

export type TGlobalAppStore = {
  app: TAppState;
}

export enum EStatus {
  Idle = "idle",
  Loading = "loading",
  Error = "error",
}

export type IStateStatus = {
  status: EStatus;
  message?: string;
}
