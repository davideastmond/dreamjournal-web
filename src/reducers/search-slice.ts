import { Sd } from "@mui/icons-material";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EStatus, IStateStatus, TGlobalAppStore } from "../definitions";
import { doSearch } from "../services/search/search.service";
import { TSearchResults } from "../services/search/search.types";

export type TSearchState = {
  stateStatus: IStateStatus;
  results: TSearchResults | {};
};

const initialState: TSearchState = {
  stateStatus: { status: EStatus.Idle },
  results: {},
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
        state.results = action.payload;
      })
      .addCase(doSearchAsync.rejected, (state, action) => {
        state.stateStatus = {
          status: EStatus.Error,
          message: action.error.message,
        };
        console.log(action.error.message);
      }),
});

export const selectSearchResults = (state: TGlobalAppStore) =>
  state.search.results;
export default searchSlice.reducer;
