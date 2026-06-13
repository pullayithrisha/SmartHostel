import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchOwnerPayments = createAsyncThunk('payment/fetchOwnerPayments', async (status = '', thunkAPI) => {
  try {
    const url = status ? `/owner/payments?status=${status}` : '/owner/payments';
    const response = await api.get(url);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
  }
});

export const createPayment = createAsyncThunk('payment/createPayment', async (paymentData, thunkAPI) => {
  try {
    const response = await api.post('/owner/payments', paymentData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create payment record');
  }
});

export const updatePaymentStatus = createAsyncThunk('payment/updatePayment', async ({ id, status, note }, thunkAPI) => {
  try {
    const response = await api.put(`/owner/payments/${id}`, { status, note });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update payment status');
  }
});

export const fetchStudentPayments = createAsyncThunk('payment/fetchStudentPayments', async (_, thunkAPI) => {
  try {
    const response = await api.get('/student/payments');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
  }
});

const initialState = {
  data: [], // stores payments list
  loading: false,
  error: null
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Owner Payments
      .addCase(fetchOwnerPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOwnerPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Student Payments
      .addCase(fetchStudentPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStudentPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearPaymentErrors } = paymentSlice.actions;
export const selectPayment = (state) => state.payment;
export default paymentSlice.reducer;
