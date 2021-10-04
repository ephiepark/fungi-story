import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

import { backendApi } from '../../../firebase/firebaseInit';
import { UniverseData, UniverseInfo, UserInfo } from '../../../types/apiTypes';


export interface UniverseViewerState {
  fetchError: {errorCode: string, errorMessage: string} | null;
  fetchStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  universeInfo: UniverseInfo | null;
}

const initialState: UniverseViewerState = {
  fetchError: null,
  fetchStatus: 'idle',
  universeInfo: null,
};

export const fetchUniverseInfoAsync = createAsyncThunk(
  'universeViewer/fetchUniverseInfo',
  async (universeId: string): Promise<UniverseInfo> => {
    const response = await backendApi.genUniverseInfo({
      id: universeId,
    });
    return response.universeInfo;
  }
);

export const universeViewerSlice = createSlice({
  name: 'universeViewer',
  initialState,
  reducers: {
    resetState: state => {
      return {
        fetchError: null,
        fetchStatus: 'idle',
        universeInfo: null,
      }
    },
  },
  extraReducers: (builder) => {
    builder
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

export const { resetState } = universeViewerSlice.actions;

export const selectUniverseViewerFetchError = (state: RootState) => state.universeViewer.fetchError;
export const selectUniverseViewerFetchStatus = (state: RootState) => state.universeViewer.fetchStatus;
export const selectUniverseViewerUniverseInfo = (state: RootState) => state.universeViewer.universeInfo;

export default universeViewerSlice.reducer;
