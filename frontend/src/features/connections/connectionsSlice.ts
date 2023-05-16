import { createSlice } from '@reduxjs/toolkit'
import {
  createUserConnections,
  getAllUserConnections,
  removeConnection,
} from './connectionsAction'

const initialState: any = {
  loading: false,
  error: null,
  connections: [],
  connectionSuccess: false,
  removeConnectionSuccess: false,
  success: false,
}

const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Create user connections
    builder.addCase(createUserConnections.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(createUserConnections.fulfilled, (state, { payload }) => {
      state.loading = false
      state.connectionSuccess = !state.connectionSuccess
      state.success = true
    })

    builder.addCase(createUserConnections.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // Get all users connections
    builder.addCase(getAllUserConnections.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(getAllUserConnections.fulfilled, (state, { payload }) => {
      state.loading = false
      state.connections = payload
      state.success = true
    })

    builder.addCase(getAllUserConnections.rejected, (state, { payload }) => {
      state.loading = false
      state.connections = []
      state.error = payload
    })

    // Remove a connection
    builder.addCase(removeConnection.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(removeConnection.fulfilled, (state, { payload }) => {
      state.loading = false
      state.removeConnectionSuccess = !state.removeConnectionSuccess
      state.success = true
    })

    builder.addCase(removeConnection.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })
  },
})

export default connectionsSlice.reducer
