import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

import { UserSession } from '../../types/apiTypes';
import { authApi, backendApi } from '../../firebase/firebaseInit';

export interface SignInState {
  error: {errorCode: string, errorMessage: string} | null;
  status: 'idle' | 'processing' | 'failed';
}

const initialState: SignInState = {
  error: null,
  status: 'idle',
};

export const signInAsync = createAsyncThunk(
  'signIn/signInRequest',
  async (signInRequest: {email: string, password: string}): Promise<UserSession> => {
    const userCredential = await authApi.genSignInWithEmailAndPassword(
      signInRequest.email,
      signInRequest.password
    );
    const response = await backendApi.genUserInfo({
      id: userCredential.user.uid
    });
    // The value we return becomes the `fulfilled` action payload
    return {
      id: userCredential.user.uid,
      isVerified: userCredential.user.emailVerified,
      userInfo: response.userInfo,
    };
  }
);

export const signInSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signInAsync.pending, (state) => {
        state.status = 'processing';
        state.error = null;
      })
      .addCase(signInAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(signInAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = {
          errorCode: action.error.code ?? '',
          errorMessage: action.error.message ?? '',
        };
      });
  },
});

// export const { } = signInSlice.actions;

export const selectSignInError = (state: RootState) => state.signIn.error;
export const selectSignInStatus = (state: RootState) => state.signIn.status;

export default signInSlice.reducer;
