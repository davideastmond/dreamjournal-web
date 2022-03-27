import { TAppState } from "./reducers/app-slice";
import { TJournalState } from "./reducers/journal-slice";

export type TGlobalAppStore = {
  app: TAppState;
  journal: TJournalState;
};

export enum EStatus {
  Idle = "idle",
  Loading = "loading",
  Error = "error",
}

export type IStateStatus = {
  status: EStatus;
  message?: string;
};
