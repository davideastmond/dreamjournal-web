import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EStatus, IStateStatus, TGlobalAppStore } from "../definitions";
import {
  deleteJournalById,
  getAllJournalsForUser,
} from "../services/journal/journal.service";
import {
  TJournal,
  TJournalDeleteResult,
} from "../services/journal/journal.types";

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

export const deleteJournalByIdAsync = createAsyncThunk(
  "journal/deleteJournalById",
  async ({
    journalId,
  }: {
    journalId: string;
  }): Promise<TJournalDeleteResult> => {
    return deleteJournalById({ journalId });
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
      })
      .addCase(deleteJournalByIdAsync.pending, (state) => {
        state.stateStatus = {
          status: EStatus.Loading,
          message: "Attempting to delete journal by id",
        };
      })
      .addCase(deleteJournalByIdAsync.fulfilled, (state, action) => {
        state.stateStatus = {
          status: EStatus.Idle,
        };
        state.journals = action.payload.journals;
      })
      .addCase(deleteJournalByIdAsync.rejected, (state, action) => {
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
export const selectJournalById = (id: string) => (state: TGlobalAppStore) => {
  return state.journal.journals.find((j) => j._id === id);
};

export const selectJournalEntryById =
  ({
    journalId,
    journalEntryId,
  }: {
    journalId: string | null;
    journalEntryId: string | null;
  }) =>
  (state: TGlobalAppStore) => {
    if (!journalId || !journalEntryId) return null;
    const entry = state.journal.journals.find((j) => j._id === journalId);
    return entry?.journalEntries.find(
      (jEntry) => jEntry._id === journalEntryId
    );
  };
export default journalSlice.reducer;
