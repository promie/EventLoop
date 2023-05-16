import { createSlice } from '@reduxjs/toolkit'
import { getAnalyticsInfoByUserId } from './analyticsAction'

const initialState: any = {
  loading: false,
  error: null,
  success: false,
  statistics: null,
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Get analytics info based on the UserID
    builder.addCase(getAnalyticsInfoByUserId.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(
      getAnalyticsInfoByUserId.fulfilled,
      (state, { payload }) => {
        state.loading = false
        state.statistics = payload
        state.success = true
      },
    )

    builder.addCase(getAnalyticsInfoByUserId.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
      state.statistics = null
    })
  },
})

export default analyticsSlice.reducer
