import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Owner Room CRUD
export const fetchRooms = createAsyncThunk('room/fetchRooms', async (_, thunkAPI) => {
  try {
    const response = await api.get('/owner/rooms');
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch rooms');
  }
});

export const createRoom = createAsyncThunk('room/createRoom', async (roomData, thunkAPI) => {
  try {
    const response = await api.post('/owner/rooms', roomData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create room');
  }
});

export const updateRoom = createAsyncThunk('room/updateRoom', async ({ id, roomData }, thunkAPI) => {
  try {
    const response = await api.put(`/owner/rooms/${id}`, roomData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update room');
  }
});

export const deleteRoom = createAsyncThunk('room/deleteRoom', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/owner/rooms/${id}`);
    return { id, ...response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete room');
  }
});

// Owner Student Approval / Room Assignment
export const fetchStudents = createAsyncThunk('room/fetchStudents', async (_, thunkAPI) => {
  try {
    const response = await api.get('/owner/students');
    return response.data.data; // { pending: [], approved: [] }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
  }
});

export const approveStudent = createAsyncThunk('room/approveStudent', async ({ id, roomId }, thunkAPI) => {
  try {
    const response = await api.put(`/owner/students/${id}/approve`, { roomId });
    return { id, ...response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to approve student');
  }
});

export const rejectStudent = createAsyncThunk('room/rejectStudent', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/owner/students/${id}/reject`);
    return { id, ...response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to reject student');
  }
});

export const deleteStudent = createAsyncThunk('room/deleteStudent', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/owner/students/${id}`);
    return { id, ...response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete student');
  }
});

export const assignRoom = createAsyncThunk('room/assignRoom', async ({ studentId, roomId }, thunkAPI) => {
  try {
    const response = await api.put(`/owner/students/${studentId}/assign-room`, { roomId });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to assign room');
  }
});

export const removeRoom = createAsyncThunk('room/removeRoom', async (studentId, thunkAPI) => {
  try {
    const response = await api.put(`/owner/students/${studentId}/remove-room`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove room assignment');
  }
});

// Student available rooms and request
export const fetchAvailableRooms = createAsyncThunk('room/fetchAvailableRooms', async (filters = {}, thunkAPI) => {
  try {
    let queryStr = '';
    const { type, floor, maxRent } = filters;
    const params = [];
    if (type) params.push(`type=${type}`);
    if (floor) params.push(`floor=${floor}`);
    if (maxRent) params.push(`maxRent=${maxRent}`);
    if (params.length > 0) queryStr = '?' + params.join('&');

    const response = await api.get(`/student/rooms/available${queryStr}`);
    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch available rooms');
  }
});

export const requestRoom = createAsyncThunk('room/requestRoom', async (roomId, thunkAPI) => {
  try {
    const response = await api.post(`/student/rooms/request/${roomId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to request room');
  }
});

const initialState = {
  data: [], // contains the list of rooms
  availableRooms: [],
  students: { pending: [], approved: [] },
  loading: false,
  error: null
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    clearRoomErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Available Rooms
      .addCase(fetchAvailableRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.availableRooms = action.payload;
      })
      .addCase(fetchAvailableRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearRoomErrors } = roomSlice.actions;
export const selectRoom = (state) => state.room;
export default roomSlice.reducer;
