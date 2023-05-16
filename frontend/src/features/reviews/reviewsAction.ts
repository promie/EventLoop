import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
}

const getReviewsByEventId = createAsyncThunk(
  'reviews/getReviewsByEventId',
  async ({ eventId }: any, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/v1/reviews/${eventId}?size=100`,
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

const getReviewsByUserId = createAsyncThunk(
  'reviews/getReviewsByUserId',
  async ({ userId }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const authConfig = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.get(
        `/api/v1/users/reviews/${userId}?size=100`,
        authConfig,
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

const leaveReviewForEvent = createAsyncThunk(
  'reviews/leaveReviewForEvent',
  async (
    { userId, eventId, rating, comment }: any,
    { getState, rejectWithValue },
  ) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const authConfig = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      }

      const payload = {
        user_id: Number(userId),
        event_id: Number(eventId),
        rating,
        comment,
      }

      const { data } = await axios.post('/api/v1/reviews', payload, authConfig)

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

export { getReviewsByEventId, getReviewsByUserId, leaveReviewForEvent }
