import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchOwnerComplaints = createAsyncThunk('complaint/fetchOwnerComplaints', async (status = '', thunkAPI) => {
  try {
    const url = status ? `/owner/complaints?status=${status}` : '/owner/complaints';
    const response = await api.get(url);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch complaints');
  }
});

export const updateComplaint = createAsyncThunk('complaint/updateComplaint', async ({ id, status, ownerNote }, thunkAPI) => {
  try {
    const response = await api.put(`/owner/complaints/${id}`, { status, ownerNote });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update complaint');
  }
});

export const fetchStudentComplaints = createAsyncThunk('complaint/fetchStudentComplaints', async (_, thunkAPI) => {
  try {
    const response = await api.get('/student/complaints');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch complaints');
  }
});

export const raiseComplaint = createAsyncThunk('complaint/raiseComplaint', async (complaintData, thunkAPI) => {
  try {
    const response = await api.post('/student/complaints', complaintData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to file complaint');
  }
});

const initialState = {
  data: [], // stores complaints list
  loading: false,
  error: null
};

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    clearComplaintErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Owner Complaints
      .addCase(fetchOwnerComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOwnerComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Student Complaints
      .addCase(fetchStudentComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudentComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearComplaintErrors } = complaintSlice.actions;
export const selectComplaint = (state) => state.complaint;
export default complaintSlice.reducer;
