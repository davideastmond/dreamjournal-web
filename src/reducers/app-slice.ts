import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EStatus, IStateStatus, TGlobalAppStore } from "../definitions";

export interface TAppState {
  stateStatus: IStateStatus;
}

const initialState: TAppState = {
  stateStatus: { status: EStatus.Idle },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
});

export const selectAppStateStatus = (state: TGlobalAppStore): IStateStatus =>
  state.app.stateStatus;

export default appSlice.reducer;
