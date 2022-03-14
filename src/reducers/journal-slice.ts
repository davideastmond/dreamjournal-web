import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EStatus, IStateStatus, TGlobalAppStore } from "../definitions";
import { getAllJournalsForUser } from "../services/journal/journal.service";
import { TJournal } from "../services/journal/journal.types";

export interface TJournalState {
  stateStatus: IStateStatus;
  journals: TJournal[];
}

const initialState: TJournalState = {
  stateStatus: { status: EStatus.Idle },
  journals: [],
};

export const getAllJournalsForUserAsync = createAsyncThunk(
  "journal/getAllJournalsForUserAsync",
  async ({ userId }: { userId: string }): Promise<TJournal[]> => {
    return getAllJournalsForUser(userId);
  }
);
const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllJournalsForUserAsync.pending, (state) => {
        state.stateStatus = {
          status: EStatus.Loading,
          message: "Fetching journal data",
        };
      })
      .addCase(getAllJournalsForUserAsync.fulfilled, (state, action) => {
        state.stateStatus = {
          status: EStatus.Idle,
        };
        state.journals = action.payload;
      })
      .addCase(getAllJournalsForUserAsync.rejected, (state, action) => {
        state.stateStatus = {
          status: EStatus.Error,
          message: action.error.message,
        };
      });
  },
});

export const selectJournalStateStatus = (state: TGlobalAppStore) =>
  state.journal.stateStatus;
export const selectJournals = (state: TGlobalAppStore) =>
  state.journal.journals;
export default journalSlice.reducer;
