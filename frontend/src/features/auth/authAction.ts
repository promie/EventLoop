import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import format from 'date-fns/format'
import { ILogin, IRegister } from '../../interfaces/auth'

const configHeaders = {
  headers: {
    'Content-Type': 'application/json',
  },
}

const registerUser = createAsyncThunk(
  'auth/register',
  async (
    {
      firstName,
      lastName,
      email,
      dateOfBirth,
      billingAddress,
      password,
    }: IRegister,
    { rejectWithValue },
  ) => {
    try {
      // constructed the payload to be the same as the fields on the backend
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        birthday: format(dateOfBirth, 'yyyy-MM-dd'),
        address: billingAddress.address,
        gps_coord: `lat: ${billingAddress.coordinates.lat}, lng: ${billingAddress.coordinates.lng}`,
        password: password,
      }

      // make request to backend
      await axios.post('/api/v1/auth/register', payload, configHeaders)
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

const verifyRegisteredUser = createAsyncThunk(
  'auth/verifyEmail',
  async ({ email }: any, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        '/api/v1/auth/register/verify',
        { email },
        configHeaders,
      )

      return data
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email, frontEndHost }: any, { rejectWithValue }) => {
    try {
      const payload = {
        email,
        frontend_host: frontEndHost,
      }

      const { data } = await axios.post(
        '/api/v1/auth/forget_password',
        payload,
        configHeaders,
      )

      return data
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ newPassword, resetToken }: any, { rejectWithValue }) => {
    try {
      const payload = {
        new_password: newPassword,
        reset_token: resetToken,
      }

      const { data } = await axios.patch(
        '/api/v1/auth/forget_password',
        payload,
        configHeaders,
      )

      return data
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (
    { email, currentPassword, newPassword }: any,
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
        email,
        current_password: currentPassword,
        new_password: newPassword,
      }

      const { data } = await axios.patch(
        '/api/v1/auth/change_password',
        payload,
        config,
      )

      return data
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: ILogin, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        '/api/v1/auth/login',
        { email, password },
        configHeaders,
      )

      // store user's token in local storage
      // Handle to check if the token will expire
      localStorage.setItem('userId', data.data.user_id)
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('email', email)

      return data
    } catch (error: any) {
      // return custom error message from API if any
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  },
)

export {
  registerUser,
  loginUser,
  verifyRegisteredUser,
  forgotPassword,
  resetPassword,
  changePassword,
}
