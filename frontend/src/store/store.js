import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import roomReducer from './roomSlice';
import paymentReducer from './paymentSlice';
import complaintReducer from './complaintSlice';
import noticeReducer from './noticeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    room: roomReducer,
    payment: paymentReducer,
    complaint: complaintReducer,
    notice: noticeReducer
  }
});
