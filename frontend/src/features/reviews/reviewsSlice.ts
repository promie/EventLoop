import { createSlice } from '@reduxjs/toolkit'
import {
  getReviewsByEventId,
  getReviewsByUserId,
  leaveReviewForEvent,
} from './reviewsAction'

const initialState: any = {
  reviews: [],
  userReviews: [],
  loading: false,
  error: null,
  reviewError: null,
  success: false,
  userPostReviewComplete: false,
}

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Get Reviews Info By Event ID
    builder.addCase(getReviewsByEventId.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(getReviewsByEventId.fulfilled, (state, { payload }) => {
      state.loading = false
      state.reviews = payload
      state.success = true
    })

    builder.addCase(getReviewsByEventId.rejected, (state, { payload }) => {
      state.loading = false
      state.reviews = []
      state.error = payload
    })

    // Get Reviews By User ID
    builder.addCase(getReviewsByUserId.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(getReviewsByUserId.fulfilled, (state, { payload }) => {
      state.loading = false
      state.userReviews = payload
      state.success = true
    })

    builder.addCase(getReviewsByUserId.rejected, (state, { payload }) => {
      state.loading = false
      state.userReviews = []
      state.error = payload
    })

    // Leave review for event
    builder.addCase(leaveReviewForEvent.pending, state => {
      state.isLoading = true
      state.reviewError = false
    })

    builder.addCase(leaveReviewForEvent.fulfilled, (state, { payload }) => {
      state.loading = false
      state.userPostReviewComplete = !state.userPostReviewComplete
      state.success = true
    })

    builder.addCase(leaveReviewForEvent.rejected, (state, { payload }) => {
      state.loading = false
      state.reviewError = payload
    })
  },
})

export default reviewsSlice.reducer
