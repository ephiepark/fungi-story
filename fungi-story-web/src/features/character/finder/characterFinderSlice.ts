import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

import { backendApi } from '../../../firebase/firebaseInit';
import { UniverseInfo, CharacterInfo } from '../../../types/apiTypes';


export interface CharacterFinderState {
  error: {errorCode: string, errorMessage: string} | null;
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  characterInfoList: Array<CharacterInfo>;
}

const initialState: CharacterFinderState = {
  error: null,
  status: 'idle',
  characterInfoList: [],
};

export const fetchCharacterInfoListForUniverseAsync = createAsyncThunk(
  'characterFinder/fetchCharacterForUniverse',
  async (universeId: string): Promise<Array<CharacterInfo>> => {
    const response = await backendApi.genCharacterInfoListForUniverse({
      universeId: universeId,
    });
    return response.characterInfoList;
  }
);

export const characterFinderSlice = createSlice({
  name: 'characterFinder',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacterInfoListForUniverseAsync.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchCharacterInfoListForUniverseAsync.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.error = null;
        state.characterInfoList = action.payload;
      })
      .addCase(fetchCharacterInfoListForUniverseAsync.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = {
          errorCode: action.error.code ?? '',
          errorMessage: action.error.message ?? '',
        };
      });
  },
});

// export const { } = signInSlice.actions;

export const selectCharacterFinderError = (state: RootState) => state.characterFinder.error;
export const selectCharacterFinderStatus = (state: RootState) => state.characterFinder.status;
export const selectCharacterFinderCharacterInfoList = (state: RootState) => state.characterFinder.characterInfoList;

export default characterFinderSlice.reducer;
