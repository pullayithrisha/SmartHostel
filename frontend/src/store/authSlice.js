import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const login = createAsyncThunk('auth/login', async ({ email, password, role }, thunkAPI) => {
  try {
    const response = await api.post('/auth/login', { email, password, role });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (formData, thunkAPI) => {
  try {
    const response = await api.post('/auth/register', formData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async ({ email }, thunkAPI) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ email, otp }, thunkAPI) => {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data; // contains tempToken
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'OTP verification failed');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ tempToken, password }, thunkAPI) => {
  try {
    const response = await api.post('/auth/reset-password', { tempToken, password });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Password reset failed');
  }
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, thunkAPI) => {
  try {
    const response = await api.get('/student/profile');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, thunkAPI) => {
  try {
    const response = await api.put('/student/profile', profileData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update profile');
  }
});

export const uploadPhoto = createAsyncThunk('auth/uploadPhoto', async (formData, thunkAPI) => {
  try {
    const response = await api.post('/student/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data; // returns filename
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Photo upload failed');
  }
});

export const changePassword = createAsyncThunk('auth/changePassword', async ({ oldPassword, newPassword }, thunkAPI) => {
  try {
    const response = await api.put('/student/change-password', { oldPassword, newPassword });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to change password');
  }
});

const userFromStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const initialState = {
  user: userFromStorage,
  data: userFromStorage, // satisfies specifications
  loading: false,
  error: null,
  successMsg: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.data = null;
      state.loading = false;
      state.error = null;
      state.successMsg = null;
    },
    clearAuthError: (state) => {
      state.error = null;
      state.successMsg = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.data = action.payload.data;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.data = action.payload.data;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.data = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Photo
      .addCase(uploadPhoto.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) {
          state.data.profilePhoto = action.payload.filename;
        }
        if (state.user) {
          state.user.profilePhoto = action.payload.filename;
        }
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
