import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EStatus, IStateStatus } from "../definitions";
import { doSearch } from "../services/search/search.service";

export type TSearchState = {
  stateStatus: IStateStatus;
  results: any[];
};

const initialState: TSearchState = {
  stateStatus: { status: EStatus.Idle },
  results: [],
};

export const doSearchAsync = createAsyncThunk(
  "search/doSearchAsync",
  async ({ data }: { data: string }) => {
    return doSearch({ data });
  }
);
export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(doSearchAsync.pending, (state) => {
        state.stateStatus = {
          status: EStatus.Loading,
        };
      })
      .addCase(doSearchAsync.fulfilled, (state, action) => {
        state.stateStatus = {
          status: EStatus.Idle,
        };
        console.log("payload action", action.payload);
      })
      .addCase(doSearchAsync.rejected, (state, action) => {
        state.stateStatus = {
          status: EStatus.Error,
          message: action.error.message,
        };
        console.log(action.error.message);
      }),
});

export default searchSlice.reducer;
