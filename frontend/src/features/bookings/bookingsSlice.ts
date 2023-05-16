import { createSlice } from '@reduxjs/toolkit'
import { createBooking, customerCancelsBooking } from './bookingsAction'

const initialState: any = {
  bookings: [],
  loading: false,
  error: null,
  success: false,
  customerCancelsBookingSuccess: false,
  createBookingSuccess: false,
}

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Create Booking
    builder.addCase(createBooking.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(createBooking.fulfilled, (state, { payload }) => {
      state.loading = false
      state.createBookingSuccess = !state.createBookingSuccess
      state.success = true
    })

    builder.addCase(createBooking.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // Customer cancels booking
    builder.addCase(customerCancelsBooking.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(customerCancelsBooking.fulfilled, (state, { payload }) => {
      state.loading = false
      state.customerCancelsBookingSuccess = !state.customerCancelsBookingSuccess
      state.success = true
    })

    builder.addCase(customerCancelsBooking.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })
  },
})

export default bookingSlice.reducer
