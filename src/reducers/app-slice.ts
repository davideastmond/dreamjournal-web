import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EStatus, IStateStatus, TGlobalAppStore } from "../definitions";
import { getAvailableSecurityQuestions } from "../services/authentication/authentication.security.service";
import { verifyActiveSession } from "../services/authentication/authentication.service";
import { TSecurityQuestionTemplate } from "../services/authentication/authentication.types";
import {
  getSessionUser,
  patchUserProfile,
} from "../services/user/user.service";
import { TSecureUser } from "../services/user/user.types";

export interface TAppState {
  stateStatus: IStateStatus;
  sessionUser: TSecureUser | null;
  hasActiveSession: boolean;
  allSecurityQuestions: TSecurityQuestionTemplate[];
}

const initialState: TAppState = {
  stateStatus: { status: EStatus.Idle },
  sessionUser: null,
  hasActiveSession: false,
  allSecurityQuestions: [],
};

export const getSessionUserAsync = createAsyncThunk(
  "app/getSessionUserAsync",
  async (): Promise<TSecureUser> => {
    return getSessionUser();
  }
);

export const getHasActiveSessionAsync = createAsyncThunk(
  "app/verifyHasActiveSession",
  async () => {
    return verifyActiveSession();
  }
);

export const patchUserBasicProfileDataAsync = createAsyncThunk(
  "app/patchUserBasicProfileDataAsync",
  async ({
    firstName,
    lastName,
    userId,
  }: {
    firstName: string;
    lastName: string;
    userId: string;
  }) => {
    return patchUserProfile({ firstName, lastName, userId });
  }
);

export const getAvailableSecurityQuestionsAsync = createAsyncThunk(
  "app/getAvailableSecurityQuestionsAsync",
  async () => {
    return getAvailableSecurityQuestions();
  }
);
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSessionUserAsync.pending, (state) => {
        state.stateStatus = {
          status: EStatus.Loading,
          message: "Getting session user...",
        };
      })
      .addCase(getSessionUserAsync.fulfilled, (state, action) => {
        state.stateStatus = {
          status: EStatus.Idle,
        };
        state.sessionUser = action.payload;
      })
      .addCase(getSessionUserAsync.rejected, (state, action) => {
        state.stateStatus = {
          status: EStatus.Error,
          message: action.error.message,
        };
        state.sessionUser = null;
      })
      .addCase(getHasActiveSessionAsync.pending, (state) => {
        state.stateStatus = {
          status: EStatus.Loading,
          message: "checking for active session",
        };
      })
      .addCase(getHasActiveSessionAsync.fulfilled, (state, action) => {
        state.stateStatus = {
          status: EStatus.Idle,
        };
        state.hasActiveSession = action.payload;
      })
      .addCase(getHasActiveSessionAsync.rejected, (state, action) => {
        state.stateStatus = {
          status: EStatus.Error,
          message: action.error.message,
        };
        state.hasActiveSession = false;
      })
      .addCase(patchUserBasicProfileDataAsync.pending, (state) => {
        state.stateStatus = {
          status: EStatus.Loading,
          message: "completing profile data update",
        };
      })
      .addCase(patchUserBasicProfileDataAsync.fulfilled, (state, action) => {
        state.stateStatus = {
          status: EStatus.Idle,
        };
        state.sessionUser = action.payload;
      })
      .addCase(patchUserBasicProfileDataAsync.rejected, (state, action) => {
        state.stateStatus = {
          status: EStatus.Error,
          message: action.error.message,
        };
      })
      .addCase(getAvailableSecurityQuestionsAsync.pending, (state) => {
        state.stateStatus = {
          status: EStatus.Loading,
          message: "Fetching possible security questions",
        };
      })
      .addCase(
        getAvailableSecurityQuestionsAsync.fulfilled,
        (state, action) => {
          state.stateStatus = {
            status: EStatus.Idle,
          };
          state.allSecurityQuestions = action.payload;
        }
      )
      .addCase(getAvailableSecurityQuestionsAsync.rejected, (state, action) => {
        state.stateStatus = {
          status: EStatus.Error,
          message: action.error.message,
        };
      });
  },
});

export const selectAppStateStatus = (state: TGlobalAppStore): IStateStatus =>
  state.app.stateStatus;

export const selectSessionUser = (state: TGlobalAppStore): TSecureUser | null =>
  state.app.sessionUser;

export const selectHasActiveSession = (state: TGlobalAppStore): boolean =>
  state.app.hasActiveSession;

export const selectPossibleSecurityQuestions = (
  state: TGlobalAppStore
): TSecurityQuestionTemplate[] => state.app.allSecurityQuestions;

export default appSlice.reducer;
