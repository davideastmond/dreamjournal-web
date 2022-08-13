import { TAppState } from "./reducers/app-slice";
import { TJournalState } from "./reducers/journal-slice";
import { TSearchState } from "./reducers/search-slice";
import dayjs from "dayjs";
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

export const DATE_CONSTANTS = {
  ADULT_AGE: dayjs().subtract(18, "year"),
};
