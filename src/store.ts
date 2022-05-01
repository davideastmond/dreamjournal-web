import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducers/app-slice";
import journalReducer from "./reducers/journal-slice";
import searchReducer from "./reducers/search-slice";
export const store = configureStore({
  reducer: {
    app: appReducer,
    journal: journalReducer,
    search: searchReducer,
  },
});
