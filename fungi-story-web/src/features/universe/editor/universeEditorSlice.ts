import { useRadioGroup } from '@mui/material';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

import { backendApi } from '../../../firebase/firebaseInit';
import { UniverseData, UniverseInfo, UserInfo } from '../../../types/apiTypes';


export interface UniverseEditorState {
  fetchError: {errorCode: string, errorMessage: string} | null;
  fetchStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  updateError: {errorCode: string, errorMessage: string} | null;
  updateStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  universeInfo: UniverseInfo | null;
}

const initialState: UniverseEditorState = {
  fetchError: null,
  fetchStatus: 'idle',
  updateError: null,
  updateStatus: 'idle',
  universeInfo: null,
};

export const fetchUniverseInfoAsync = createAsyncThunk(
  'universeEditor/fetchUniverseInfo',
  async (universeId: string): Promise<UniverseInfo> => {
    const response = await backendApi.genUniverseInfo({
      id: universeId,
    });
    return response.universeInfo;
  }
);

export const createUniverseAsync = createAsyncThunk(
  'universeEditor/createUniverseAsync',
  async (request: {userId: string, universeData: UniverseData}): Promise<UniverseInfo> => {
    const response = await backendApi.genCreateUniverse({
      creator_user_id: request.userId,
      universe_data: request.universeData,
    });
    console.log(response);
    return response.universeInfo;
  }
);

export const updateUniverseAsync = createAsyncThunk(
  'universeEditor/updateUniverseAsync',
  async (request: {universeId: string, userId: string, universeData: UniverseData}): Promise<UniverseInfo> => {
    const response = await backendApi.genUpdateUniverse({
      id: request.universeId,
      updater_user_id: request.userId,
      universeData: request.universeData,
    });
    console.log(response);
    return response.universeInfo;
  }
);

export const universeEditorSlice = createSlice({
  name: 'universeEditor',
  initialState,
  reducers: {
    resetState: state => {
      return {
        fetchError: null,
        fetchStatus: 'idle',
        updateError: null,
        updateStatus: 'idle',
        universeInfo: state.universeInfo,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUniverseAsync.pending, (state) => {
        state.updateStatus = 'pending';
        state.updateError = null;
        state.universeInfo = null;
      })
      .addCase(createUniverseAsync.fulfilled, (state, action) => {
        state.updateStatus = 'fulfilled';
        state.updateError = null;
        state.universeInfo = action.payload;
      })
      .addCase(createUniverseAsync.rejected, (state, action) => {
        state.updateStatus = 'rejected';
        state.updateError = {
          errorCode: action.error.code ?? '',
          errorMessage: action.error.message ?? '',
        };
        state.universeInfo = null;
      })
      .addCase(updateUniverseAsync.pending, (state) => {
        state.updateStatus = 'pending';
        state.updateError = null;
        state.universeInfo = null;
      })
      .addCase(updateUniverseAsync.fulfilled, (state, action) => {
        state.updateStatus = 'fulfilled';
        state.updateError = null;
        state.universeInfo = action.payload;
      })
      .addCase(updateUniverseAsync.rejected, (state, action) => {
        state.updateStatus = 'rejected';
        state.updateError = {
          errorCode: action.error.code ?? '',
          errorMessage: action.error.message ?? '',
        };
        state.universeInfo = null;
      })
      .addCase(fetchUniverseInfoAsync.pending, (state) => {
        state.fetchStatus = 'pending';
        state.fetchError = null;
        state.universeInfo = null;
      })
      .addCase(fetchUniverseInfoAsync.fulfilled, (state, action) => {
        state.fetchStatus = 'fulfilled';
        state.fetchError = null;
        state.universeInfo = action.payload;
      })
      .addCase(fetchUniverseInfoAsync.rejected, (state, action) => {
        state.fetchStatus = 'rejected';
        state.fetchError = {
          errorCode: action.error.code ?? '',
          errorMessage: action.error.message ?? '',
        };
        state.universeInfo = null;
      });
  },
});

export const { resetState } = universeEditorSlice.actions;

export const selectUniverseEditorFetchError = (state: RootState) => state.universeEditor.fetchError;
export const selectUniverseEditorFetchStatus = (state: RootState) => state.universeEditor.fetchStatus;
export const selectUniverseEditorUpdateError = (state: RootState) => state.universeEditor.updateError;
export const selectUniverseEditorUpdateStatus = (state: RootState) => state.universeEditor.updateStatus;
export const selectUniverseEditorUniverseInfo = (state: RootState) => state.universeEditor.universeInfo;

export default universeEditorSlice.reducer;
