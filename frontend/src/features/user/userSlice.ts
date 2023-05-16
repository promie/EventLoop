import { createSlice } from '@reduxjs/toolkit'
import {
  getUserInfoByUserId,
  updateProfileSocialAndInterests,
  updateProfileAccount,
  updateProfileAddress,
  getHostUpcomingCreatedEventsByUserId,
  getHostPreviousCreatedEventsByUserId,
  getCustomerUpcomingBookingsByUserId,
  getCustomerPreviousBookingsByUserId,
  getBookingReceiptInfoByBookingId,
  getUserNotifications,
  readNotificationMessage,
  getConnectionProfileDetailsByUserId,
} from './userAction'

const initialState: any = {
  userInfo: null,
  loading: false,
  error: null,
  success: false,
  readNotificationSuccess: false,
  hostUpcomingEvents: [],
  hostPreviousEvents: [],
  customerUpcomingBookings: [],
  customerPreviousBookings: [],
  bookingReceiptInfo: [],
  notifications: [],
  connectionInfo: [],
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserInfoFromStorage: state => {
      localStorage.removeItem('userInfo')
      state.userInfo = null
      state.loading = false
      state.error = null
      state.success = false
    },
    setUserInfoFromStorage: (state, { payload }) => {
      state.userInfo = payload
    },
  },
  extraReducers: builder => {
    // Get UserInfo Info By User ID
    builder.addCase(getUserInfoByUserId.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(getUserInfoByUserId.fulfilled, (state, { payload }) => {
      state.loading = false
      state.userInfo = payload
      state.success = true
    })

    builder.addCase(getUserInfoByUserId.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // Update UserInfo based off the response from the Profile Account
    builder.addCase(updateProfileAccount.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(updateProfileAccount.fulfilled, (state, { payload }) => {
      state.loading = false
      state.userInfo = payload
      state.success = true
    })

    builder.addCase(updateProfileAccount.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // Update UserInfo based off the response from the Profile Address
    builder.addCase(updateProfileAddress.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(updateProfileAddress.fulfilled, (state, { payload }) => {
      state.loading = false
      state.userInfo = payload
      state.success = true
    })

    builder.addCase(updateProfileAddress.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // Update UserInfo based off the response from the Profile Social and Interests
    builder.addCase(updateProfileSocialAndInterests.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(
      updateProfileSocialAndInterests.fulfilled,
      (state, { payload }) => {
        state.loading = false
        state.userInfo = payload
        state.success = true
      },
    )

    builder.addCase(
      updateProfileSocialAndInterests.rejected,
      (state, { payload }) => {
        state.loading = false
        state.error = payload
      },
    )

    // Get hosts upcoming events
    builder.addCase(getHostUpcomingCreatedEventsByUserId.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(
      getHostUpcomingCreatedEventsByUserId.fulfilled,
      (state, { payload }) => {
        state.loading = false
        state.hostUpcomingEvents = payload
        state.success = true
      },
    )

    builder.addCase(
      getHostUpcomingCreatedEventsByUserId.rejected,
      (state, { payload }) => {
        state.loading = false
        state.hostUpcomingEvents = []
        state.error = payload
      },
    )

    // Get hosts previous events
    builder.addCase(getHostPreviousCreatedEventsByUserId.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(
      getHostPreviousCreatedEventsByUserId.fulfilled,
      (state, { payload }) => {
        state.loading = false
        state.hostPreviousEvents = payload
        state.success = true
      },
    )

    builder.addCase(
      getHostPreviousCreatedEventsByUserId.rejected,
      (state, { payload }) => {
        state.loading = false
        state.hostPreviousEvents = []
        state.error = payload
      },
    )

    // Get customer upcoming bookings
    builder.addCase(getCustomerUpcomingBookingsByUserId.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(
      getCustomerUpcomingBookingsByUserId.fulfilled,
      (state, { payload }) => {
        state.loading = false
        state.customerUpcomingBookings = payload
        state.success = true
      },
    )

    builder.addCase(
      getCustomerUpcomingBookingsByUserId.rejected,
      (state, { payload }) => {
        state.loading = false
        state.customerUpcomingBookings = []
        state.error = payload
      },
    )

    // Get customer previous bookings
    builder.addCase(getCustomerPreviousBookingsByUserId.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(
      getCustomerPreviousBookingsByUserId.fulfilled,
      (state, { payload }) => {
        state.loading = false
        state.customerPreviousBookings = payload
        state.success = true
      },
    )

    builder.addCase(
      getCustomerPreviousBookingsByUserId.rejected,
      (state, { payload }) => {
        state.loading = false
        state.customerPreviousBookings = []
        state.error = payload
      },
    )

    // Get booking receipt info by booking Id
    builder.addCase(getBookingReceiptInfoByBookingId.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(
      getBookingReceiptInfoByBookingId.fulfilled,
      (state, { payload }) => {
        state.loading = false
        state.bookingReceiptInfo = payload
        state.success = true
      },
    )

    builder.addCase(
      getBookingReceiptInfoByBookingId.rejected,
      (state, { payload }) => {
        state.loading = false
        state.bookingReceiptInfo = []
        state.error = payload
      },
    )

    // Get user notifications
    builder.addCase(getUserNotifications.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(getUserNotifications.fulfilled, (state, { payload }) => {
      state.loading = false
      state.notifications = payload
      state.success = true
    })

    builder.addCase(getUserNotifications.rejected, (state, { payload }) => {
      state.loading = false
      state.notifications = []
      state.error = payload
    })

    // Read notification message
    builder.addCase(readNotificationMessage.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(readNotificationMessage.fulfilled, (state, { payload }) => {
      state.loading = false
      state.readNotificationSuccess = !state.readNotificationSuccess
    })

    builder.addCase(readNotificationMessage.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // Get connection info
    builder.addCase(getConnectionProfileDetailsByUserId.pending, state => {
      state.isLoading = true
      state.error = false
    })

    builder.addCase(
      getConnectionProfileDetailsByUserId.fulfilled,
      (state, { payload }) => {
        state.loading = false
        state.connectionInfo = payload
      },
    )

    builder.addCase(
      getConnectionProfileDetailsByUserId.rejected,
      (state, { payload }) => {
        state.loading = false
        state.error = payload
        state.connectionInfo = []
      },
    )
  },
})

export const { clearUserInfoFromStorage, setUserInfoFromStorage } =
  userSlice.actions

export default userSlice.reducer
