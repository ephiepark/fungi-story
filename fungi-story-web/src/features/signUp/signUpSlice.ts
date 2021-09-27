import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

import { CreateUserRequest, UserSession } from '../../types/apiTypes';

import { authApi, backendApi } from '../../firebase/firebaseInit';
import { parseIsolatedEntityName } from 'typescript';

export interface SignUpState {
  error: {errorCode: string, errorMessage: string} | null;
  status: 'idle' | 'processing' | 'failed';
}

const initialState: SignUpState = {
  error: null,
  status: 'idle',
};

export const signUpAsync = createAsyncThunk(
  'signUp/signUpRequest',
  async (request: {email: string, password: string, penName: string}): Promise<UserSession> => {
    const userCredential = await authApi.genSignUpWithEmailAndPassword(
      request.email,
      request.password
    );
    const response = await backendApi.genCreateUser({
      id: userCredential.user.uid,
      email: request.email,
      pen_name: request.penName,
    });
    // The value we return becomes the `fulfilled` action payload
    return {
      id: userCredential.user.uid,
      isVerified: userCredential.user.emailVerified,
      userInfo: response.userInfo,
    };
  }
);

export const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.status = 'processing';
        state.error = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.status = 'idle';
        state.error = {
          errorCode: action.error.code ?? '',
          errorMessage: action.error.message ?? '',
        };
      });
  },
});

// export const { } = signInSlice.actions;

export const selectSignUpError = (state: RootState) => state.signUp.error;
export const selectSignUpStatus = (state: RootState) => state.signUp.status;

export default signUpSlice.reducer;
