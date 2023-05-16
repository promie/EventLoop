import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async ({ payload }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post('/api/v1/bookings', payload, config)

      return data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

const customerCancelsBooking = createAsyncThunk(
  'bookings/customerCancelsBooking',
  async ({ bookingId }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.delete(
        `api/v1/bookings/${bookingId}`,
        config,
      )

      return data
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

export { createBooking, customerCancelsBooking }
