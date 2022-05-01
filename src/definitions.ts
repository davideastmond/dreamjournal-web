import { TAppState } from "./reducers/app-slice";
import { TJournalState } from "./reducers/journal-slice";
import { TSearchState } from "./reducers/search-slice";

export type TGlobalAppStore = {
  app: TAppState;
  journal: TJournalState;
  search: TSearchState;
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
