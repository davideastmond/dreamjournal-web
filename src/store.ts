import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducers/app-slice";
import journalReducer from "./reducers/journal-slice";
export const store = configureStore({
  reducer: {
    app: appReducer,
    journal: journalReducer,
  },
});
