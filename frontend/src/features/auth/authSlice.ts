import { createSlice } from '@reduxjs/toolkit'
import {
  registerUser,
  loginUser,
  verifyRegisteredUser,
  forgotPassword,
  resetPassword,
  changePassword,
} from './authAction'
import { IStateInitial } from '../../interfaces/auth'

const initialState: IStateInitial = {
  loading: false,
  userId: null,
  token: null,
  error: null,
  success: false,
  pageLoad: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      localStorage.removeItem('token') // deletes token from storage
      localStorage.removeItem('userId')
      localStorage.removeItem('email')
      state.loading = false
      state.userId = null
      state.token = null
      state.error = null
    },
    triggerLoadingState: state => {
      state.pageLoad = true
    },
    stopLoadingState: state => {
      state.pageLoad = false
    },
    setTokenFromStorage: (state, { payload }) => {
      state.token = payload
    },
  },
  extraReducers: builder => {
    // register
    builder.addCase(registerUser.pending, state => {
      state.loading = true
      state.error = false
    })

    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.loading = false
      state.success = true
    })

    builder.addCase(registerUser.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // login
    builder.addCase(loginUser.pending, state => {
      state.loading = true
      state.error = null
    })

    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.loading = false
      // @ts-ignore
      state.token = payload.access_token
      state.userId = payload.data.user_id
    })

    builder.addCase(loginUser.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // verify whether the user whether he/she already has an account
    builder.addCase(verifyRegisteredUser.pending, state => {
      state.loading = true
      state.error = null
    })

    builder.addCase(verifyRegisteredUser.fulfilled, (state, { payload }) => {
      state.loading = false
    })

    builder.addCase(verifyRegisteredUser.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

    // forgot password
    builder.addCase(forgotPassword.pending, state => {
      state.loading = true
      state.error = null
    })

    builder.addCase(forgotPassword.fulfilled, (state, { payload }) => {
      state.loading = false
    })

    builder.addCase(forgotPassword.rejected, (state, { payload }) => {
      state.loading = false
      state.error = null
    })

    // reset password
    builder.addCase(resetPassword.pending, state => {
      state.loading = true
      state.error = null
    })

    builder.addCase(resetPassword.fulfilled, (state, { payload }) => {
      state.loading = false
    })

    builder.addCase(resetPassword.rejected, (state, { payload }) => {
      state.loading = false
      state.error = null
    })

    // reset password
    builder.addCase(changePassword.pending, state => {
      state.loading = true
      state.error = null
    })

    builder.addCase(changePassword.fulfilled, (state, { payload }) => {
      state.loading = false
    })

    builder.addCase(changePassword.rejected, (state, { payload }) => {
      state.loading = false
      state.error = null
    })
  },
})

export const {
  logout,
  triggerLoadingState,
  stopLoadingState,
  setTokenFromStorage,
} = authSlice.actions
export default authSlice.reducer
