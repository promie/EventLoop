import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const getAnalyticsInfoByUserId = createAsyncThunk(
  'analytics/getAnalyticsInfoByUserId',
  async ({ userId }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const { data } = await axios.get(`/api/v1/statistics/${userId}`, config)

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

export { getAnalyticsInfoByUserId }
