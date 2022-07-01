import { configureStore, combineReducers } from "@reduxjs/toolkit";
import type { PreloadedState } from "@reduxjs/toolkit";
import appReducer from "./reducers/app-slice";
import journalReducer from "./reducers/journal-slice";
import searchReducer from "./reducers/search-slice";

const rootReducer = combineReducers({
  app: appReducer,
  journal: journalReducer,
  search: searchReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
