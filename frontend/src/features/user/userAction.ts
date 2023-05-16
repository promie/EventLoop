import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const getUserInfoByUserId = createAsyncThunk(
  'user/getUserInfoByUserId',
  async ({ userId }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const { data } = await axios.get(`/api/v1/users/${userId}`, config)

      // Save user details into localStorage
      localStorage.setItem('userInfo', JSON.stringify(data))

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

const updateProfileSocialAndInterests = createAsyncThunk(
  'user/updateProfileSocialAndInterests',
  async (
    { userId, aboutMe, phoneNumber, facebook, matchingOption, interests }: any,
    { getState, rejectWithValue },
  ) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const payload = {
        about_me: aboutMe,
        phone: phoneNumber,
        website_url: facebook,
        matching_option: matchingOption || false,
        interests: interests,
      }

      const { data } = await axios.patch(
        `/api/v1/users/${userId}`,
        payload,
        config,
      )

      // Save user details into localStorage
      localStorage.setItem('userInfo', JSON.stringify(data))

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

const updateProfileAccount = createAsyncThunk(
  'user/updateProfileAccount',
  async ({ userId, gender, photoURL }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const payload = {
        gender,
        photo_url: photoURL,
      }

      const { data } = await axios.patch(
        `/api/v1/users/${userId}`,
        payload,
        config,
      )

      // Save user details into localStorage
      localStorage.setItem('userInfo', JSON.stringify(data))

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

const updateProfileAddress = createAsyncThunk(
  'user/updateProfileAddress',
  async (
    { userId, billingAddress, coordinates, homeAddress }: any,
    { getState, rejectWithValue },
  ) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const payload = {
        billing_add: billingAddress,
        billing_gps_coord: coordinates,
        home_add: homeAddress,
        home_gps_coord: coordinates,
      }

      const { data } = await axios.patch(
        `/api/v1/users/${userId}`,
        payload,
        config,
      )

      // Save user details into localStorage
      localStorage.setItem('userInfo', JSON.stringify(data))

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

const getHostUpcomingCreatedEventsByUserId = createAsyncThunk(
  'user/getCreatedEventsByUserId',
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
        `/api/v1/users/created_events/${userId}?status=Ticket%20Available%2CSold%20Out%2CPostponed&size=100`,
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

const getHostPreviousCreatedEventsByUserId = createAsyncThunk(
  'user/getHostPreviousCreatedEventsByUserId',
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
        `/api/v1/users/created_events/${userId}?status=Finished%2CCancelled&size=100`,
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

const getCustomerUpcomingBookingsByUserId = createAsyncThunk(
  'user/getCustomerUpcomingBookingsByUserId',
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
        `/api/v1/users/bookings/${userId}?status=Ticket%20Available%2CSold%20Out%2CPostponed&size=100`,
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

const getCustomerPreviousBookingsByUserId = createAsyncThunk(
  'user/getCustomerPreviousBookingsByUserId',
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
        `/api/v1/users/bookings/${userId}?status=Finished&size=100`,
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

const getBookingReceiptInfoByBookingId = createAsyncThunk(
  'booking/getBookingReceiptInfoByBookingId',
  async ({ bookingId }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const { data } = await axios.get(`/api/v1/bookings/${bookingId}`, config)

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

const getUserNotifications = createAsyncThunk(
  'user/getUserNotifications',
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
        `/api/v1/notifications/user/${userId}`,
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

const readNotificationMessage = createAsyncThunk(
  'user/readNotificationMessage',
  async ({ notificationId, type }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const payload = {
        type,
        is_read: true,
      }

      const { data } = await axios.patch(
        `/api/v1/notifications/${notificationId}`,
        payload,
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

const getConnectionProfileDetailsByUserId = createAsyncThunk(
  'user/getConnectionProfileDetailsByUserId',
  async ({ userId, ownerId }: any, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const { auth } = getState()

      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }

      const { data } = await axios.get(
        `/api/v1/users/profile/${userId}?owner_id=${ownerId}`,
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

export {
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
}
