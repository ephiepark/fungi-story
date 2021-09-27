import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

import { backendApi } from '../../../firebase/firebaseInit';
import { UniverseInfo, UserInfo } from '../../../types/apiTypes';


export interface UniverseFinderState {
  error: {errorCode: string, errorMessage: string} | null;
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  universeInfoList: Array<UniverseInfo>;
}

const initialState: UniverseFinderState = {
  error: null,
  status: 'idle',
  universeInfoList: [],
};

export const fetchUniverseInfoListForUserAsync = createAsyncThunk(
  'universeFinder/fetchUniverseForUser',
  async (userInfo: UserInfo): Promise<Array<UniverseInfo>> => {
    const response = await backendApi.genUniverseInfoListForUser({
      user_id: userInfo.id,
    });
    return response.universeInfoList;
  }
);

export const universeFinderSlice = createSlice({
  name: 'universeFinder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUniverseInfoListForUserAsync.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchUniverseInfoListForUserAsync.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.error = null;
        state.universeInfoList = action.payload;
      })
      .addCase(fetchUniverseInfoListForUserAsync.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = {
          errorCode: action.error.code ?? '',
          errorMessage: action.error.message ?? '',
        };
      });
  },
});

// export const { } = signInSlice.actions;

export const selectUniverseFinderError = (state: RootState) => state.universeFinder.error;
export const selectUniverseFinderStatus = (state: RootState) => state.universeFinder.status;
export const selectUniverseFinderUniverseInfoList = (state: RootState) => state.universeFinder.universeInfoList;

export default universeFinderSlice.reducer;
