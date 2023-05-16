import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import eventsReducer from './features/events/eventsSlice'
import userReducer from './features/user/userSlice'
import bookingsReducer from './features/bookings/bookingsSlice'
import reviewsReducer from './features/reviews/reviewsSlice'
import analyticsReducer from './features/analytics/analyticsSlice'
import connectionsReducer from './features/connections/connectionsSlice'

export const store = configureStore({
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    auth: authReducer,
    analytics: analyticsReducer,
    events: eventsReducer,
    user: userReducer,
    bookings: bookingsReducer,
    reviews: reviewsReducer,
    connections: connectionsReducer,
  },
})
