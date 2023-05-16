import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const createUserConnections = createAsyncThunk(
  'connections/createUserConnections',
  async ({ ownerId, memberId }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const payload = {
        owner_id: Number(ownerId),
        member_id: Number(memberId),
      }

      const { data } = await axios.post(`/api/v1/connections`, payload, config)

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

const getAllUserConnections = createAsyncThunk(
  'connections/getAllUserConnections',
  async ({ userId }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const { data } = await axios.get(
        `/api/v1/connections/all/${userId}`,
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

const removeConnection = createAsyncThunk(
  'connections/removeConnection',
  async ({ connectionId }: any, { getState, rejectWithValue }) => {
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
        `api/v1/connections/${connectionId}`,
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

export { createUserConnections, getAllUserConnections, removeConnection }
