import { createSlice } from '@reduxjs/toolkit'
// utils
import axios from 'src/utils/axios'
// redux
import { dispatch } from '../store'

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  selectedSubscription: null,

  isSelectedSubscription: false,
  subscriptions: [],
  isPaymentInitialized: true, // this will trigger payment page after login
  temp_user: null,
  user: null,
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false
      state.error = action.payload
    },

    // GET USER SUBSCRIPTIONS
    getSubscriptionsSuccess(state, action) {
      state.isLoading = false
      state.isAuthenticated = false
      state.subscriptions = action.payload
    },

    // GET USER SELECTED SUBSCRIPTION
    getUserSelectedSubscriptions(state, action) {
      // state.isLoading = false
      // state.isAuthenticated = false
      // state.subscriptions = action.payload
      state.error = null
      state.selectedSubscription = action.payload
    },

    // GET USER
    getUserSuccess(state, action) {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.selectedSubscription = action.payload.subscription
    },

    // INITIATE USER PAYMENT
    initiatePayment(state, action) {
      state.isSelectedSubscription = false
      state.subscriptions = action.payload.subscriptions
      state.isAuthenticated = false
      state.isInitialized = true
      state.isPaymentInitialized = true // this will trigger payment page after login
      state.temp_user = user
      state.user = null
    },

    // LOGOUT
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      state.selectedSubscription = null
      state.subscriptions = []
      state.error = null
    },
  },
})

// Reducer
export default slice.reducer

// Actions
export const { getSubscriptionsSuccess, getUserSelectedSubscriptions } = slice.actions

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function getUserSubscription() {
  return async () => {
    try {
      const response = await axios.get('/user/subscriptions')
      dispatch(slice.actions.getSubscriptionsSuccess(response.data))
    } catch (error) {
      console.error(error)
      dispatch(slice.actions.hasError(error))
    }
  }
}

export function logoutUser() {
  return async () => {
    dispatch(slice.actions.startLoading())
    try {
      dispatch(slice.actions.logout())
    } catch (error) {
      console.error(error)
      dispatch(slice.actions.hasError(error))
    }
  }
}
export function selectUserSubscription(data) {
  return async () => {
    dispatch(slice.actions.startLoading())
    try {
      dispatch(slice.actions.getUserSelectedSubscriptions(data.subscription))
      dispatch(slice.actions.getUserSuccess(data))
    } catch (error) {
      console.error(error)
      dispatch(slice.actions.hasError(error))
    }
  }
}
