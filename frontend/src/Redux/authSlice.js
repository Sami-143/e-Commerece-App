import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../Api/authApi';
import { toast } from 'react-toastify';

// register -> backend sends OTP (no token)
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, thunkAPI) => {
    try {
      const res = await api.register(formData);
      return res.data; // { success: true, message, email }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// verify OTP -> backend issues token via sendToken (cookie) AND returns user info
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, thunkAPI) => {
    try {
      const res = await api.verifyOtp({ email, otp });
      return res.data; // expect token/user or at least success and user
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async ({ email }, thunkAPI) => {
    try {
      const res = await api.resendOtp({ email });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Resend OTP failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, thunkAPI) => {
    try {
      const res = await api.login(formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    pendingEmail: null, // store email waiting for verification
    loading: false,
    error: null,
  },
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.pendingEmail = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingEmail = action.payload.email || state.pendingEmail;
        toast.success(action.payload.message || "OTP sent to email");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // verify OTP
      .addCase(verifyOtp.pending, (state) => { state.loading = true; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        // If backend returns user in body, set it:
        if (action.payload.user) state.user = action.payload.user;
        if (action.payload.token) state.token = action.payload.token;
        state.pendingEmail = null;
        toast.success("OTP verified, logged in");
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // resend
      .addCase(resendOtp.pending, (state) => { state.loading = true; })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload.message || "OTP resent");
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // login
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) state.user = action.payload.user;
        if (action.payload.token) state.token = action.payload.token;
        toast.success("Login successful");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { logoutLocal, clearError } = authSlice.actions;
export default authSlice.reducer;
