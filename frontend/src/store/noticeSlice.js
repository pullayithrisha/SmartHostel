import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchNotices = createAsyncThunk('notice/fetchNotices', async (_, thunkAPI) => {
  try {
    const response = await api.get('/notices');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch notices');
  }
});

export const createNotice = createAsyncThunk('notice/createNotice', async (noticeData, thunkAPI) => {
  try {
    const response = await api.post('/notices', noticeData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create notice');
  }
});

export const updateNotice = createAsyncThunk('notice/updateNotice', async ({ id, noticeData }, thunkAPI) => {
  try {
    const response = await api.put(`/notices/${id}`, noticeData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update notice');
  }
});

export const deleteNotice = createAsyncThunk('notice/deleteNotice', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/notices/${id}`);
    return { id, ...response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete notice');
  }
});

const initialState = {
  data: [], // stores notices list
  loading: false,
  error: null
};

const noticeSlice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    clearNoticeErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notices
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearNoticeErrors } = noticeSlice.actions;
export const selectNotice = (state) => state.notice;
export default noticeSlice.reducer;
